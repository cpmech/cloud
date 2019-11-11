import AWS from 'aws-sdk';

export const adminAddUserToGroup = async (
  poolId: string,
  username: string,
  group: string,
  verbose = false,
  region: string = 'us-east-1',
) => {
  // cognito
  const cognito = new AWS.CognitoIdentityServiceProvider({ region });

  // create group if inexistent
  if (verbose) {
    console.log('... creating group ...');
  }
  const groupParams = {
    GroupName: group,
    UserPoolId: poolId,
  };
  try {
    await cognito.getGroup(groupParams).promise();
  } catch (error) {
    // ignore error => group does not exist
    await cognito.createGroup(groupParams).promise();
  }

  // add user to group
  if (verbose) {
    console.log(`... adding user to group ...`);
  }
  const addUserParams = {
    GroupName: group,
    UserPoolId: poolId,
    Username: username,
  };
  await cognito.adminAddUserToGroup(addUserParams).promise();
};
