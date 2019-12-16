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
  verbose = false,
): Promise<string[]> => {
  //
  // cognito
  const cognito = new AWS.CognitoIdentityServiceProvider({ region });

  // output
  const usernames: string[] = [];

  // for each user
  for (const user of users) {
    // check if user exists already
    if (verbose) {
      console.log(`... checking if ${user.email} exists already ...`);
    }
    const existent = await adminFindUsersByEmail(poolId, user.email, region);
    if (existent.length > 0) {
      if (verbose) {
        console.log(
          `[ERROR] email does exist already. cannot create over existent user ${user.email}`,
        );
      }
      throw new Error(`cannot create over existent user ${user.email}`);
    }

    // create user
    if (verbose) {
      console.log(`... creating new user ...`);
    }
    const newUser = await cognito
      .signUp({
        ClientId: clientId,
        Username: user.email,
        Password: user.password,
      })
      .promise();

    // username
    const username = newUser.UserSub;
    if (verbose) {
      console.log(`... printing new username ...`);
      console.log(username);
    }

    // set email_verified = true
    if (verbose) {
      console.log(`... setting email_verified = true ...`);
    }
    await adminSetAttributes(poolId, username, { email_verified: 'true' }, region);

    // add user to group
    for (const group of user.groups.split(',')) {
      if (verbose) {
        console.log(`... adding user to group (${group}) ...`);
      }
      await adminAddUserToGroup(poolId, username, group);
    }

    // confirm user
    if (verbose) {
      console.log(`... confirming user ...`);
    }
    await cognito
      .adminConfirmSignUp({
        UserPoolId: poolId,
        Username: username,
      })
      .promise();
    if (verbose) {
      console.log('... confirmed ...');
    }

    // store username
    usernames.push(username);

    // message
    if (verbose) {
      console.log(`... success (${user.email}) ...`);
    }
  }

  if (verbose) {
    console.log(`... adminCreateUsers completed successfully ...`);
  }
  return usernames;
};
