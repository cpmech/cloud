import AWS from 'aws-sdk';

export const addUserToGroup = async (
  poolId: string,
  userName: string,
  groupName: string,
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
    GroupName: groupName,
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
    GroupName: groupName,
    UserPoolId: poolId,
    Username: userName,
  };
  await cognito.adminAddUserToGroup(addUserParams).promise();
};
