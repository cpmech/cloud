import AWS from 'aws-sdk';
import { ICognitoUser } from './types';
import { flattenAttributes } from '../helpers/flattenAttributes';

export const adminFindUserByEmail = async (
  poolId: string,
  email: string,
  region: string = 'us-east-1',
): Promise<ICognitoUser> => {
  const cognito = new AWS.CognitoIdentityServiceProvider({ region });

  const res = await cognito
    .listUsers({
      UserPoolId: poolId,
      Filter: `email = \"${email}\"`,
    })
    .promise();

  if (!res.Users || res.Users.length === 0) {
    throw new Error(`cannot find user with email = ${email}`);
  }

  if (res.Users.length !== 1) {
    throw new Error(`there are more users with email = ${email}`);
  }

  return flattenAttributes(res.Users[0]);
};
