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

const envars = {
  CLOUD_COGNITO_POOLID: '',
  CLOUD_COGNITO_CLIENTID: '',
  CLOUD_RECV_DOMAIN: '',
  CLOUD_RECV_QUEUE_URL: '',
  CLOUD_BENDER_USERNAME: '',
};

initEnvars(envars);

AWS.config.update({
  region: 'us-east-1',
});

let emailBender = `tester+bender@${envars.CLOUD_RECV_DOMAIN}`;

describe('adminListUsers', () => {
  it('should list users', async () => {
    const users = await adminListUsers(envars.CLOUD_COGNITO_POOLID);
    const res = users.find((u) => u.Data.email === emailBender);
    const user: ICognitoUser = res as ICognitoUser;
    expect(user.Username).toBe(envars.CLOUD_BENDER_USERNAME);
    expect(user.Data.email).toBe(emailBender);
    expect(user.Data.email_verified).toBe('true');
  });
});

describe('adminFindUserByEmail', () => {
  it('should find user by email', async () => {
    const user = await adminFindUserByEmail(envars.CLOUD_COGNITO_POOLID, emailBender);
    expect(user.Username).toBe(envars.CLOUD_BENDER_USERNAME);
    expect(user.Data.email).toBe(emailBender);
    expect(user.Data.email_verified).toBe('true');
  });
});

describe('adminFindUserByUsername', () => {
  it('should find user by username', async () => {
    const userByEmail = await adminFindUserByEmail(envars.CLOUD_COGNITO_POOLID, emailBender);

    const username = userByEmail.Username;
    if (!username) {
      fail('cannot get username');
    }

    const user = await adminFindUserByUsername(envars.CLOUD_COGNITO_POOLID, username);
    expect(user.Username).toBe(envars.CLOUD_BENDER_USERNAME);
    expect(user.Data.email).toBe(emailBender);
    expect(user.Data.email_verified).toBe('true');
  });
});

describe('adminGetUser', () => {
  it('should get user', async () => {
    const userByEmail = await adminFindUserByEmail(envars.CLOUD_COGNITO_POOLID, emailBender);

    const username = userByEmail.Username;
    if (!username) {
      fail('cannot get username');
    }

    const user = await adminGetUser(envars.CLOUD_COGNITO_POOLID, username);
    expect(user.UserAttributes).toEqual([
      { Name: 'sub', Value: username },
      { Name: 'email_verified', Value: 'true' },
      { Name: 'email', Value: emailBender },
    ]);
  });
});
