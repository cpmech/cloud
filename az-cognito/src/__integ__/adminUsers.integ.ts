import AWS from 'aws-sdk';
import {
  adminListUsers,
  adminFindUserByEmail,
  ICognitoUser,
  adminFindUserByUsername,
  adminGetUser,
} from '../admin';
import { initEnvars } from '@cpmech/envars';

jest.setTimeout(20000);

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//                                                                 //
//  the user pool name is:    az-cognito-testing                   //
//                                                                 //
//  NOTE: This user pool was created "by hand" in the AWS Console  //
//                                                                 //
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

const envars = {
  USER_POOL_ID: '',
  USER_POOL_CLIENT_ID: '',
  BENDER_USERNAME: '',
  QUEUE_URL: '',
};

initEnvars(envars);

const EMAIL = 'bender.rodriguez@futurama.space';

describe('adminListUsers', () => {
  it('should list users', async () => {
    const users = await adminListUsers(envars.USER_POOL_ID);
    const res = users.find(u => u.Data.email === EMAIL);
    const user: ICognitoUser = res as ICognitoUser;
    expect(user.Username).toBe(envars.BENDER_USERNAME);
    expect(user.Data.email).toBe(EMAIL);
    expect(user.Data.email_verified).toBe('true');
  });
});

describe('adminFindUserByEmail', () => {
  it('should find user by email', async () => {
    const user = await adminFindUserByEmail(envars.USER_POOL_ID, EMAIL);
    expect(user.Username).toBe(envars.BENDER_USERNAME);
    expect(user.Data.email).toBe(EMAIL);
    expect(user.Data.email_verified).toBe('true');
  });
});

describe('adminFindUserByUsername', () => {
  it('should find user by username', async () => {
    const userByEmail = await adminFindUserByEmail(envars.USER_POOL_ID, EMAIL);

    const username = userByEmail.Username;
    if (!username) {
      fail('cannot get username');
    }

    const user = await adminFindUserByUsername(envars.USER_POOL_ID, username);
    expect(user.Username).toBe(envars.BENDER_USERNAME);
    expect(user.Data.email).toBe(EMAIL);
    expect(user.Data.email_verified).toBe('true');
  });
});

describe('adminGetUser', () => {
  it('shoud get user', async () => {
    const userByEmail = await adminFindUserByEmail(envars.USER_POOL_ID, EMAIL);

    const username = userByEmail.Username;
    if (!username) {
      fail('cannot get username');
    }

    const user = await adminGetUser(envars.USER_POOL_ID, username);
    expect(user.UserAttributes).toEqual([
      { Name: 'sub', Value: username },
      { Name: 'email_verified', Value: 'true' },
      { Name: 'email', Value: EMAIL },
    ]);
  });
});
