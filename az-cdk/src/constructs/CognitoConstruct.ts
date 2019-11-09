import { Aws, Construct } from '@aws-cdk/core';
import {
  CfnUserPool,
  CfnUserPoolClient,
  CfnUserPoolDomain,
  CfnUserPoolIdentityProvider,
  SignInType,
  UserPool,
  UserPoolAttribute,
  UserPoolClient,
} from '@aws-cdk/aws-cognito';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { IRole, PolicyStatement } from '@aws-cdk/aws-iam';
import { LambdaLayersConstruct } from './LambdaLayersConstruct';

export interface ICognitoProps {
  poolName: string;
  emailSendingAccount: string;
  customAttributes?: string[]; // string, and mutable. NOTE: do not prefix with custom
  customDomain?: string;
  customDomainCertArn?: string;
  facebookClientId?: string;
  facebookClientSecret?: string;
  googleClientId?: string;
  googleClientSecret?: string;
  callbackUrls?: string[];
  logoutUrls?: string[];
  updateClientSettings?: boolean; // must use false for the first time
  postConfirmTrigger?: boolean; // will need a lambda called cognitoPostConfirm.handler (uses CommonLibs layers too)
  postConfirmSendEmail?: boolean; // postConfirm function needs access to SES to send emails
  postConfirmDynamoTable?: string; // postConfirm function needs access to this DynamoDB Table
  useLayers?: boolean; // lambda triggers will use layers
  dirLayers?: string; // for lambda triggers. default = 'layers'
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
        layers = new LambdaLayersConstruct(this, 'Layers', { dirLayers: props.dirLayers });
      }

      postConfirmation = new Function(this, 'PostConfirm', {
        runtime: Runtime.NODEJS_10_X,
        code: Code.fromAsset('dist'),
        handler: `cognitoPostConfirm.handler`,
        layers: layers ? layers.all : undefined,
      });

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
      signInType: SignInType.EMAIL,
      autoVerifiedAttributes: [UserPoolAttribute.EMAIL],
      lambdaTriggers: {
        postConfirmation,
      },
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
      cfnPool.schema = props.customAttributes.map(name => ({
        attributeDataType: 'String',
        mutable: true,
        name,
      }));
    }

    // some flags
    const hasCustomDomain = !!(props.customDomain && props.customDomainCertArn);
    const hasFacebook = !!(props.facebookClientId && props.facebookClientSecret);
    const hasGoogle = !!(props.googleClientId && props.googleClientSecret);
    const hasIdp = hasFacebook || hasGoogle;

    // custom domain
    if (hasCustomDomain) {
      new CfnUserPoolDomain(this, 'PoolDomain', {
        userPoolId: pool.userPoolId,
        domain: props.customDomain as string,
        customDomainConfig: {
          certificateArn: props.customDomainCertArn,
        },
      });
    }

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
    }

    // update pool client with IdPs data
    if (hasIdp && props.updateClientSettings) {
      const cfnClient = client.node.findChild('Resource') as CfnUserPoolClient;
      cfnClient.allowedOAuthFlows = ['code'];
      cfnClient.allowedOAuthFlowsUserPoolClient = true;
      cfnClient.allowedOAuthScopes = [
        'phone',
        'email',
        'openid',
        'aws.cognito.signin.user.admin',
        'profile',
      ];
      cfnClient.callbackUrLs = props.callbackUrls;
      cfnClient.logoutUrLs = props.logoutUrls;
      if (props.callbackUrls && props.callbackUrls.length > 0) {
        cfnClient.defaultRedirectUri = props.callbackUrls[0];
      }
      cfnClient.supportedIdentityProviders = ['COGNITO'];
      if (hasFacebook) {
        cfnClient.supportedIdentityProviders.push('Facebook');
      }
      if (hasGoogle) {
        cfnClient.supportedIdentityProviders.push('Google');
      }
      cfnClient.writeAttributes = ['email', 'name'];
    }
  }
}
