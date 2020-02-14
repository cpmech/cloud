import AWS from 'aws-sdk';
import { ICognitoUser } from './types';
import { flattenAttributes } from '../helpers';

export const adminFindUserByUsername = async (
  poolId: string,
  username: string,
  region: string = 'us-east-1',
): Promise<ICognitoUser> => {
  const cognito = new AWS.CognitoIdentityServiceProvider({ region });

  const res = await cognito
    .listUsers({
      UserPoolId: poolId,
      Filter: `username = \"${username}\"`,
    })
    .promise();

  if (!res.Users || res.Users.length === 0) {
    throw new Error(`cannot find user with username = ${username}`);
  }

  if (res.Users.length !== 1) {
    throw new Error(`there are more users with username = ${username}`);
  }

  return flattenAttributes(res.Users[0]);
};
