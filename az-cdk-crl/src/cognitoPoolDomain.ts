import AWS from 'aws-sdk';
import { hasProp } from '@cpmech/basic';
import { report } from './util/report';

const deleteUserPoolDomain = async (
  cognito: AWS.CognitoIdentityServiceProvider,
  Domain: string,
) => {
  const response = await cognito.describeUserPoolDomain({ Domain }).promise();
  if (response && response.DomainDescription && response.DomainDescription.UserPoolId) {
    await cognito
      .deleteUserPoolDomain({
        UserPoolId: response.DomainDescription.UserPoolId,
        Domain,
      })
      .promise();
  }
};

// Sets custom domain
//
// INPUT:
//
//   event.ResourceProperties {
//     UserPoolId: string;
//     DomainPrefix: string;
//   }
//
// OUTPUT:
//   The PhysicalResourceId will be equal to the DomainPrefix
//
export const cognitoPoolDomain = async (event: any, context: any) => {
  try {
    // check input
    if (!hasProp(event.ResourceProperties, 'UserPoolId')) {
      throw new Error(`ResourceProperties must have UserPoolId prop`);
    }
    if (!hasProp(event.ResourceProperties, 'DomainPrefix')) {
      throw new Error(`ResourceProperties must have DomainPrefix prop`);
    }

    // extract input
    const { UserPoolId, DomainPrefix } = event.ResourceProperties;

    // user pool domain (not full domain)
    const Domain = DomainPrefix;

    // cognito
    const cognito = new AWS.CognitoIdentityServiceProvider();

    // set the physical resource Id
    let resourceId = Domain;

    // handle request
    switch (event.RequestType) {
      case 'Create':
        console.log('..... creating user pool domain ......');
        await cognito.createUserPoolDomain({ UserPoolId, Domain }).promise();
        break;

      case 'Update':
        console.log('..... updating user pool domain ......');
        await deleteUserPoolDomain(cognito, Domain);
        await cognito.createUserPoolDomain({ UserPoolId, Domain }).promise();
        break;

      case 'Delete':
        console.log('..... deleting user pool domain ......');
        await deleteUserPoolDomain(cognito, Domain);
        resourceId = event.PhysicalResourceId;
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
    await report(event, context, 'FAILED', '', null, `${err}`);
  }
};
