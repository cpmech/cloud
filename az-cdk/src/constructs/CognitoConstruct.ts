import { Aws, Construct, Duration } from '@aws-cdk/core';
import {
  CfnUserPool,
  CfnUserPoolIdentityProvider,
  UserPool,
  UserPoolClient,
  UserVerificationConfig,
  PasswordPolicy,
} from '@aws-cdk/aws-cognito';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { IRole, PolicyStatement } from '@aws-cdk/aws-iam';
import { Iany } from '@cpmech/basic';
import { LambdaLayersConstruct } from './LambdaLayersConstruct';
import { CognitoEnableProvidersConstruct, CognitoPoolDomainConstruct } from '../custom-resources';

export interface ICognitoProps {
  poolName: string;
  emailSendingAccount: string;
  passwordPolicy?: PasswordPolicy;
  customAttributes?: string[]; // string, and mutable. NOTE: do not prefix with custom
  domainPrefix?: string;
  facebookClientId?: string;
  facebookClientSecret?: string;
  googleClientId?: string;
  googleClientSecret?: string;
  callbackUrls?: string[];
  logoutUrls?: string[];
  postConfirmTrigger?: boolean; // will need a lambda called cognitoPostConfirm.handler (uses CommonLibs layers too)
  postConfirmSendEmail?: boolean; // postConfirm function needs access to SES to send emails
  postConfirmDynamoTable?: string; // postConfirm function needs access to this DynamoDB Table
  noSelfSignUp?: boolean;
  userVerification?: UserVerificationConfig;
  useLayers?: boolean; // lambda triggers will use layers
  dirLayers?: string; // for lambda triggers. default = 'layers'
  dirDist?: string; // location of triggers [default = 'dist']
  envars?: Iany; // environmental variables passed to lambda triggers
}

export class CognitoConstruct extends Construct {
  readonly poolId: string;
  readonly clientId: string;

  constructor(scope: Construct, id: string, props: ICognitoProps) {
    super(scope, id);

    // constants
    const region = Aws.REGION;
    const account = Aws.ACCOUNT_ID;

    // postConfirmation lambda trigger
    // tslint:disable-next-line: ban-types
    let postConfirmation: Function | undefined;
    if (props.postConfirmTrigger) {
      let layers: LambdaLayersConstruct | undefined;
      if (props.useLayers) {
        layers = new LambdaLayersConstruct(this, 'Layers', {
          list: [{ name: 'CommonLibs', dirLayer: props.dirLayers }],
        });
      }

      postConfirmation = new Function(this, 'PostConfirm', {
        runtime: Runtime.NODEJS_12_X,
        code: Code.fromAsset(props.dirDist || 'dist'),
        handler: `cognitoPostConfirm.handler`,
        layers: layers ? layers.all : undefined,
        environment: props.envars,
        timeout: Duration.minutes(1),
      });

      (postConfirmation.role as IRole).addToPolicy(
        new PolicyStatement({
          actions: ['cognito-idp:*'],
          resources: ['*'],
        }),
      );

      if (props.postConfirmSendEmail) {
        (postConfirmation.role as IRole).addToPolicy(
          new PolicyStatement({
            actions: ['ses:SendEmail'],
            resources: ['*'],
          }),
        );
      }

      if (props.postConfirmDynamoTable) {
        (postConfirmation.role as IRole).addToPolicy(
          new PolicyStatement({
            actions: ['dynamodb:*'],
            resources: [
              `arn:aws:dynamodb:${region}:*:table/${props.postConfirmDynamoTable}`,
              `arn:aws:dynamodb:${region}:*:table/${props.postConfirmDynamoTable}/index/*`,
            ],
          }),
        );
      }
    }

    // pool
    const pool = new UserPool(this, 'Pool', {
      userPoolName: props.poolName,
      signInAliases: { email: true },
      autoVerify: { email: true },
      lambdaTriggers: {
        postConfirmation,
      },
      selfSignUpEnabled: props.noSelfSignUp ? false : true,
      userVerification: props.userVerification,
      passwordPolicy: props.passwordPolicy,
    });

    this.poolId = pool.userPoolId;

    // client
    const client = new UserPoolClient(this, 'PoolCient', {
      userPoolClientName: `${props.poolName}-client`,
      userPool: pool,
      generateSecret: false, // Amplify cannot handle secrets
    });

    this.clientId = client.userPoolClientId;

    // cfnPool
    const cfnPool = pool.node.findChild('Resource') as CfnUserPool;

    // set sending email
    cfnPool.emailConfiguration = {
      emailSendingAccount: 'DEVELOPER',
      sourceArn: `arn:aws:ses:${region}:${account}:identity/${props.emailSendingAccount}`,
    };

    // add custom attributes
    if (props.customAttributes) {
      cfnPool.schema = props.customAttributes.map((name) => ({
        attributeDataType: 'String',
        mutable: true,
        name,
      }));
    }

    // some flags
    const hasFacebook = !!(props.facebookClientId && props.facebookClientSecret);
    const hasGoogle = !!(props.googleClientId && props.googleClientSecret);
    const hasIdp = hasFacebook || hasGoogle;

    const providers: string[] = [];

    // Facebook identity provider
    if (hasFacebook) {
      new CfnUserPoolIdentityProvider(this, 'PoolFacebookIdP', {
        userPoolId: pool.userPoolId,
        providerName: 'Facebook',
        providerType: 'Facebook',
        providerDetails: {
          client_id: props.facebookClientId,
          client_secret: props.facebookClientSecret,
          authorize_scopes: 'public_profile,email',
        },
        attributeMapping: {
          email: 'email',
          name: 'name',
        },
      });
      providers.push('Facebook');
    }

    // Google identity provider
    if (hasGoogle) {
      new CfnUserPoolIdentityProvider(this, 'PoolGoogleIdP', {
        userPoolId: pool.userPoolId,
        providerName: 'Google',
        providerType: 'Google',
        providerDetails: {
          client_id: props.googleClientId,
          client_secret: props.googleClientSecret,
          authorize_scopes: 'profile email openid',
        },
        attributeMapping: {
          email: 'email',
          name: 'name',
        },
      });
      providers.push('Google');
    }

    // update pool client with IdPs data
    if (hasIdp) {
      new CognitoEnableProvidersConstruct(this, 'EnableProviders', {
        userPoolId: pool.userPoolId,
        userPoolClientId: client.userPoolClientId,
        providers,
        callbackUrls: props.callbackUrls,
        logoutUrls: props.logoutUrls,
      });
    }

    // set pool domain
    if (props.domainPrefix) {
      new CognitoPoolDomainConstruct(this, 'PoolDomain', {
        userPoolId: pool.userPoolId,
        domainPrefix: props.domainPrefix,
      });
    }
  }
}
