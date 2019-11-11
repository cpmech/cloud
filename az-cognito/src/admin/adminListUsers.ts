import AWS from 'aws-sdk';
import { ICognitoUser } from './types';
import { flattenAttributes } from '../helpers/flattenAttributes';

export const adminListUsers = async (
  poolId: string,
  attributesToGet?: string[],
  region: string = 'us-east-1',
): Promise<ICognitoUser[]> => {
  const cognito = new AWS.CognitoIdentityServiceProvider({ region });

  const res = await cognito
    .listUsers({
      UserPoolId: poolId,
      AttributesToGet: attributesToGet,
    })
    .promise();

  if (!res.Users || res.Users.length === 0) {
    return [];
  }

  return res.Users.map(u => flattenAttributes(u));
};
