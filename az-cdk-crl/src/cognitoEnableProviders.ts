import AWS from 'aws-sdk';
import { hasProp } from '@cpmech/basic';
import { report } from './util/report';

const updateProviders = async (
  poolId: string,
  clientId: string,
  providers: string[],
  callbackUrls: string[],
  logoutUrls: string[],
) => {
  const provs = providers.includes('COGNITO') ? providers : providers.concat(['COGNITO']);
  const redirect = callbackUrls.length > 0 ? callbackUrls[0] : undefined;
  const cognito = new AWS.CognitoIdentityServiceProvider();
  await cognito
    .updateUserPoolClient({
      UserPoolId: poolId,
      ClientId: clientId,
      SupportedIdentityProviders: provs,
      AllowedOAuthFlows: ['code'],
      AllowedOAuthFlowsUserPoolClient: true,
      AllowedOAuthScopes: ['phone', 'email', 'openid', 'aws.cognito.signin.user.admin', 'profile'],
      CallbackURLs: callbackUrls,
      LogoutURLs: logoutUrls,
      DefaultRedirectURI: redirect,
      WriteAttributes: ['email', 'name'],
    })
    .promise();
};

// cognitoAddUsers adds users to Cognito pool
//
// INPUT:
//
//   event.ResourceProperties {
//     UserPoolId: string;
//     UserPoolClientId: string;
//     Providers: string[]; // e.g. ['Facebook', 'Google']
//     CallbackUrls: string[];
//     LogoutUrls: string[];
//   }
//
// OUTPUT:
//   The PhysicalResourceId will be equal to the UserPoolId
//
export const cognitoEnableProviders = async (event: any, context: any) => {
  try {
    // check input
    if (!hasProp(event.ResourceProperties, 'UserPoolId')) {
      throw new Error(`ResourceProperties must have UserPoolId prop`);
    }
    if (!hasProp(event.ResourceProperties, 'UserPoolClientId')) {
      throw new Error(`ResourceProperties must have UserPoolClientId prop`);
    }
    if (!hasProp(event.ResourceProperties, 'Providers')) {
      throw new Error(`ResourceProperties must have Providers prop`);
    }
    if (!hasProp(event.ResourceProperties, 'CallbackUrls')) {
      throw new Error(`ResourceProperties must have CallbackUrls prop`);
    }
    if (!hasProp(event.ResourceProperties, 'LogoutUrls')) {
      throw new Error(`ResourceProperties must have LogoutUrls prop`);
    }

    // extract input
    const {
      UserPoolId,
      UserPoolClientId,
      Providers,
      CallbackUrls,
      LogoutUrls,
    } = event.ResourceProperties;

    // set the physical resource Id
    const resourceId = UserPoolId;

    // handle request
    switch (event.RequestType) {
      case 'Create':
        console.log('..... enabling providers ......');
        await updateProviders(UserPoolId, UserPoolClientId, Providers, CallbackUrls, LogoutUrls);
        break;

      case 'Update':
        console.log('..... updating providers ......');
        await updateProviders(UserPoolId, UserPoolClientId, Providers, CallbackUrls, LogoutUrls);
        break;

      case 'Delete':
        console.log('..... ignoring delete request ......');
        break;

      default:
        throw new Error(`unsupported request type ${event.RequestType}`);
    }

    // return SUCCESS message
    const responseData = {};
    await report(event, context, 'SUCCESS', resourceId, responseData);
    //
    // handle errors
  } catch (err) {
    await report(event, context, 'FAILED', '', null, err.message);
  }
};
