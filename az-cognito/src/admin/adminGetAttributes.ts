import AWS from 'aws-sdk';
import { Iany } from '@cpmech/basic';

export const adminGetAttributes = async (
  poolId: string,
  username: string,
  region: string = 'us-east-1',
): Promise<Iany> => {
  const cognito = new AWS.CognitoIdentityServiceProvider({ region });

  const user = await cognito
    .adminGetUser({
      UserPoolId: poolId,
      Username: username,
    })
    .promise();

  const { UserAttributes } = user;

  if (UserAttributes) {
    return UserAttributes.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.Name]: curr.Value,
      }),
      {} as Iany,
    );
  }

  return {};
};
