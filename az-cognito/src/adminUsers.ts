import AWS from 'aws-sdk';
import { ICognitoUser, ICognitoUserType } from './types';

export const listUsers = async (
  poolId: string,
  attributesToGet?: string[],
  region: string = 'us-east-1',
): Promise<ICognitoUser[]> => {
  const sp = new AWS.CognitoIdentityServiceProvider({ region });
  const res = await sp
    .listUsers({
      UserPoolId: poolId,
      AttributesToGet: attributesToGet,
    })
    .promise();
  if (res.Users && res.Users.length > 0) {
    return res.Users.map(u => getFlatten(u));
  } else {
    return [];
  }
};

export const findUser = async (
  email: string,
  poolId: string,
  region: string = 'us-east-1',
): Promise<ICognitoUser> => {
  const sp = new AWS.CognitoIdentityServiceProvider({ region });
  const res = await sp
    .listUsers({
      UserPoolId: poolId,
      Filter: `email = \"${email}\"`,
    })
    .promise();
  if (res.Users && res.Users.length === 1) {
    return getFlatten(res.Users[0]);
  } else {
    throw new Error(`cannot find user with email = ${email}`);
  }
};

export const deleteUser = async (
  username: string,
  poolId: string,
  region: string = 'us-east-1',
) => {
  const sp = new AWS.CognitoIdentityServiceProvider({ region });
  await sp
    .adminDeleteUser({
      UserPoolId: poolId,
      Username: username,
    })
    .promise();
};

function getFlatten(user: ICognitoUserType): ICognitoUser {
  let Data = {};
  if (user.Attributes) {
    Data = user.Attributes.reduce((acc, curr) => ({ ...acc, [curr.Name]: curr.Value }), {});
  }
  const res = {
    ...user,
    Data,
  };
  delete res.Attributes;
  return res;
}
