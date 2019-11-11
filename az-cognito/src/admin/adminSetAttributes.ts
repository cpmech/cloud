import AWS from 'aws-sdk';
import { Iany } from '@cpmech/basic';

export const adminSetAttributes = async (
  poolId: string,
  username: string,
  attributes: Iany,
  region: string = 'us-east-1',
) => {
  const cognito = new AWS.CognitoIdentityServiceProvider({ region });

  await cognito
    .adminUpdateUserAttributes({
      UserPoolId: poolId,
      Username: username,
      UserAttributes: Object.keys(attributes).map(key => ({ Name: key, Value: attributes[key] })),
    })
    .promise();
};
