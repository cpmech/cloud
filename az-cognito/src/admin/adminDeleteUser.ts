import AWS from 'aws-sdk';

export const adminDeleteUser = async (
  poolId: string,
  username: string,
  region: string = 'us-east-1',
) => {
  const cognito = new AWS.CognitoIdentityServiceProvider({ region });
  await cognito
    .adminDeleteUser({
      UserPoolId: poolId,
      Username: username,
    })
    .promise();
};
