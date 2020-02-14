import AWS from 'aws-sdk';
import { ICognitoUser } from './types';
import { flattenAttributes } from '../helpers';

export const adminFindUsersByEmail = async (
  poolId: string,
  email: string,
  region: string = 'us-east-1',
): Promise<ICognitoUser[]> => {
  const cognito = new AWS.CognitoIdentityServiceProvider({ region });

  const res = await cognito
    .listUsers({
      UserPoolId: poolId,
      Filter: `email = \"${email}\"`,
    })
    .promise();

  if (!res.Users) {
    return [];
  }

  return res.Users.map(u => flattenAttributes(u));
};
