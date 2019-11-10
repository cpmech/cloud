import fetch from 'node-fetch';
(global as any).fetch = fetch;

import Amplify from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';
import { v4 } from 'uuid';
import { deleteEmail, receiveEmail, extractCodeFromEmail } from '@cpmech/az-senqs';
import { sleep } from '@cpmech/basic';
import { initEnvars } from '@cpmech/envars';
import { deleteUser, findUser } from '../adminUsers';
import { getUserAttributes, getUserData } from '../cognitoUser';

const envars = {
  USER_POOL_ID: '',
  USER_POOL_CLIENT_ID: '',
  QUEUE_URL: '',
};

initEnvars(envars);

jest.setTimeout(100000);

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: envars.USER_POOL_ID,
    userPoolWebClientId: envars.USER_POOL_CLIENT_ID,
  },
});

const password = '123paSSword$';
let email: string = '';
let username: string = '';
let emailReceiptHandle: string = '';

const cleanUp = async () => {
  try {
    if (emailReceiptHandle) {
      await deleteEmail(emailReceiptHandle, envars.QUEUE_URL);
      console.log('... email deleted successfully ...');
    }
    if (username) {
      await deleteUser(username, envars.USER_POOL_ID);
      console.log('... user deleted successfully ...');
    }
  } catch (err) {
    console.log(err);
  }
};

beforeEach(() => {
  email = `tester+${v4()}@azcdk.xyz`;
  username = '';
  emailReceiptHandle = '';
});

afterEach(async () => {
  await cleanUp();
});

describe('cognito', () => {
  it('should signUp, confirm, and signIn successfully', async () => {
    console.log('1: signing up');
    const res = await Auth.signUp({
      username: email,
      password,
    });

    // The SignUp API generates a persistent UUID for your user,
    // and uses it as the immutable username attribute internally.
    // This UUID has the same value as the sub claim in the user identity token.
    // tslint:disable-next-line: max-line-length
    // Ref: https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html#user-pool-settings-aliases-settings
    // NOTE:
    // After singIn, use sub is in user.attributes.sub;

    username = res.userSub; // username = res.user.getUsername(); // <<< this gives the email instead
    console.log('>>> username = ', username);
    expect(res.userConfirmed).toBe(false);

    await sleep(1000);
    console.log('2: receiving email');
    const r = await receiveEmail(email, envars.QUEUE_URL);
    emailReceiptHandle = r.receiptHandle;

    console.log('3: extracting code from email');
    const code = await extractCodeFromEmail(r.content);
    console.log('>>> code = ', code);

    console.log('4: confirming email with given code');
    await Auth.confirmSignUp(username, code);
    const userJustConfirmed = await findUser(email, envars.USER_POOL_ID);
    expect(userJustConfirmed.Data.email).toBe(email);
    expect(userJustConfirmed.Data.email_verified).toBe('true');

    console.log('5: signing in');
    const user = await Auth.signIn({ username, password });
    expect(user.attributes.sub).toBe(username);
    expect(user.attributes.email_verified).toBe(true);

    console.log('6: get attributes');
    const attributes = await getUserAttributes(user);
    expect(attributes.length).toBe(3);
    expect(attributes[1]).toEqual({ Name: 'email_verified', Value: 'true' });

    console.log('7: get data');
    const data = await getUserData(user);
    expect(data.Username).toBe(username);
  });
});
