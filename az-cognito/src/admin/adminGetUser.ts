import AWS from 'aws-sdk';
import { IAdminUserResponse } from './types';

export const adminGetUser = async (
  poolId: string,
  username: string,
  region: string = 'us-east-1',
): Promise<IAdminUserResponse> => {
  const cognito = new AWS.CognitoIdentityServiceProvider({ region });

  return await cognito
    .adminGetUser({
      UserPoolId: poolId,
      Username: username,
    })
    .promise();
};
