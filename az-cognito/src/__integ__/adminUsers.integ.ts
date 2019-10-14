import fetch from 'node-fetch';
(global as any).fetch = fetch;

import Amplify from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';
import { v4 } from 'uuid';
import { deleteEmail, receiveEmail, extractCodeFromEmail } from '@cpmech/az-senqs';
import { sleep } from '@cpmech/basic';
import { initEnvars } from '@plabs/envars';
import { listUsers, findUser, deleteUser } from '../index';
import { ICognitoUser } from '../types';

const envars = {
  USER_POOL_ID: '',
  USER_POOL_CLIENT_ID: '',
  BENDER_USERNAME: '',
  BENDER_SUB: '',
  QUEUE_URL: '',
};

initEnvars(envars);

const EMAIL = 'bender.rodriguez@futurama.space';

describe('listUsers', () => {
  test('works', async () => {
    const users = await listUsers(envars.USER_POOL_ID);
    const res = users.find(u => u.Data.email === EMAIL);
    const user: ICognitoUser = res as ICognitoUser;
    expect(user.Username).toBe(envars.BENDER_USERNAME);
    expect(user.Data.email).toBe(EMAIL);
    expect(user.Data.email_verified).toBe('true');
  });
});

describe('findUser', () => {
  test('works', async () => {
    const user = await findUser(EMAIL, envars.USER_POOL_ID);
    expect(user.Username).toBe(envars.BENDER_USERNAME);
    expect(user.Data.email).toBe(EMAIL);
    expect(user.Data.email_verified).toBe('true');
  });
});

describe('cognito', () => {
  const password = '123paSSword$';
  let email: string = '';
  let username: string = '';
  let emailReceiptHandle: string = '';

  const cleanUp = async () => {
    try {
      if (emailReceiptHandle) {
        await deleteEmail(emailReceiptHandle, envars.QUEUE_URL);
      }
      if (username) {
        await deleteUser(username, envars.USER_POOL_ID);
      }
    } catch (err) {
      console.log(err);
    }
  };

  beforeAll(() => {
    jest.setTimeout(20000);
    Amplify.configure({
      Auth: {
        region: 'us-east-1',
        userPoolId: envars.USER_POOL_ID,
        userPoolWebClientId: envars.USER_POOL_CLIENT_ID,
      },
    });
  });

  beforeEach(() => {
    email = `tester+${v4()}@cpmech.com`;
  });

  afterEach(async () => {
    await cleanUp();
  });

  test('signUp, confirm, and signIn', async () => {
    // sign-up (confirmed must be false)
    const res = await Auth.signUp({
      username: email,
      password,
    });
    // username = res.user.getUsername();
    username = res.userSub;
    expect(res.userConfirmed).toBe(false);

    // extract code from email
    sleep(2000);
    const r = await receiveEmail(email, envars.QUEUE_URL);
    emailReceiptHandle = r.receiptHandle;
    const code = await extractCodeFromEmail(r.content);

    // confirm code
    await Auth.confirmSignUp(username, code);

    // sign-in (confirmed must true)
    const user = await Auth.signIn({ username, password });
    expect(user.attributes.email_verified).toBe(true);
  });
});
