import AWS from 'aws-sdk';
import { adminFindUsersByEmail } from './adminFindUsersByEmail';
import { adminAddUserToGroup } from './adminAddUserToGroup';
import { adminSetAttributes } from './adminSetAttributes';
import { IUserInput } from './types';

export const adminCreateUsers = async (
  poolId: string,
  clientId: string,
  users: IUserInput[],
  region: string = 'us-east-1',
): Promise<string[]> => {
  const cognito = new AWS.CognitoIdentityServiceProvider({ region });

  const usernames: string[] = [];

  for (const user of users) {
    const existent = await adminFindUsersByEmail(poolId, user.email, region);
    if (existent.length > 0) {
      throw new Error(`cannot create over existent user ${user.email}`);
    }

    // create user
    const newUser = await cognito
      .signUp({
        ClientId: clientId,
        Username: user.email,
        Password: user.password,
      })
      .promise();

    const username = newUser.UserSub;

    // confirm user
    await cognito
      .adminConfirmSignUp({
        UserPoolId: poolId,
        Username: username,
      })
      .promise();

    // set email_verified = true
    await adminSetAttributes(poolId, username, { email_verified: 'true' }, region);

    // add user to group
    for (const group of user.groups.split(',')) {
      await adminAddUserToGroup(poolId, username, group);
    }

    usernames.push(username);
  }

  return usernames;
};
