import AWS from 'aws-sdk';

export const adminListUserGroups = async (
  poolId: string,
  username: string,
  region = 'us-east-1',
): Promise<string[]> => {
  const cognito = new AWS.CognitoIdentityServiceProvider({ region });

  const res = await cognito
    .adminListGroupsForUser({
      UserPoolId: poolId,
      Username: username,
    })
    .promise();

  if (!res.Groups) {
    throw new Error('cannot get groups');
  }

  const groups: string[] = [];

  for (const g of res.Groups) {
    if (g.GroupName) {
      groups.push(g.GroupName);
    }
  }

  return groups;
};
