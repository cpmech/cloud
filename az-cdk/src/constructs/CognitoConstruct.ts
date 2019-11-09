import { Construct } from '@aws-cdk/core';
import {
  CfnUserPool,
  CfnUserPoolClient,
  CfnUserPoolDomain,
  CfnUserPoolIdentityProvider,
  SignInType,
  UserPool,
  UserPoolAttribute,
  UserPoolClient,
  UserPoolTriggers,
} from '@aws-cdk/aws-cognito';

export interface ICognitoProps {
  poolName: string;
  emailSendingAccount: string;
  customAttributes?: string[]; // string, and mutable. NOTE: do not prefix with custom
  lambdaTriggers?: UserPoolTriggers;
  customDomain?: string;
  customDomainCertArn?: string;
  facebookClientId?: string;
  facebookClientSecret?: string;
  googleClientId?: string;
  googleClientSecret?: string;
  callbackUrls?: string[];
  logoutUrls?: string[];
}

export class CognitoConstruct extends Construct {
  readonly poolId: string;
  readonly clientId: string;

  constructor(scope: Construct, id: string, props: ICognitoProps) {
    super(scope, id);

    // pool
    const pool = new UserPool(this, 'Pool', {
      userPoolName: props.poolName,
      signInType: SignInType.EMAIL,
      autoVerifiedAttributes: [UserPoolAttribute.EMAIL],
      lambdaTriggers: props.lambdaTriggers,
    });

    this.poolId = pool.userPoolId;

    // client
    const client = new UserPoolClient(this, 'PoolCient', {
      userPoolClientName: `${props.poolName}-client`,
      userPool: pool,
      generateSecret: false, // Amplify cannot handle secrets
    });

    this.clientId = client.userPoolClientId;

    // constants
    const region = pool.stack.region;
    const accountId = pool.stack.account;
    const cfnPool = pool.node.findChild('Resource') as CfnUserPool;

    // set sending email
    cfnPool.emailConfiguration = {
      emailSendingAccount: 'DEVELOPER',
      sourceArn: `arn:aws:ses:${region}:${accountId}:identity/${props.emailSendingAccount}`,
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
    if (hasIdp) {
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
