import fetch from 'node-fetch';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).fetch = fetch;
import AWS from 'aws-sdk';
import Amplify from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';
import Enquirer from 'enquirer';
import { deleteEmail, receiveEmail, extractCodeFromEmail } from '@cpmech/az-senqs';
import { mlog } from '@cpmech/basic';
import { IEnvars } from '@cpmech/envars';
import { adminFindUserByEmail, ICognitoUser } from '../admin';

export interface ICognitoEnvars extends IEnvars {
  COGNITO_POOLID: string;
  COGNITO_CLIENTID: string;
  RECV_DOMAIN: string;
  RECV_QUEUE_URL: string;
}

let envars: IEnvars;

export const initCognitoTools = (initializedCognitoEnvars: ICognitoEnvars) => {
  envars = initializedCognitoEnvars;
  AWS.config.update({
    region: 'us-east-1',
  });
  Amplify.configure({
    Auth: {
      region: 'us-east-1',
      userPoolId: envars.COGNITO_POOLID,
      userPoolWebClientId: envars.COGNITO_CLIENTID,
    },
  });
};

export const signUp = async (email: string, password: string): Promise<ICognitoUser> => {
  mlog(`1: signing up: ${email}`);
  const res = await Auth.signUp({ username: email, password });
  const username = res.userSub; // username = res.user.getUsername(); // <<< this gives the email instead
  mlog(`... username = ${username} ...`);

  mlog('2: receiving email');
  const emailCode = await receiveEmail(email, envars.RECV_QUEUE_URL, 20, 2000);

  mlog('3: deleting email');
  await deleteEmail(emailCode.receiptHandle, envars.RECV_QUEUE_URL);

  mlog('4: extracting code from email');
  const code = await extractCodeFromEmail(emailCode.content);
  mlog(`... code = ${code} ...`);

  mlog('5: confirming email with given code');
  await Auth.confirmSignUp(username, code);

  mlog('... returning Cognito User ...');
  return await adminFindUserByEmail(envars.COGNITO_POOLID, email);
};

export const signUpAskCode = async (email: string, password: string): Promise<ICognitoUser> => {
  mlog(`1: signing up: ${email}`);
  const res = await Auth.signUp({ username: email, password });
  const username = res.userSub; // username = res.user.getUsername(); // <<< this gives the email instead
  mlog(`... username = ${username} ...`);

  mlog('2: get code');
  const response = await Enquirer.prompt([
    {
      type: 'input',
      name: 'code',
      message: 'What is code?',
    },
  ]);
  const code = (response as any).code as string;
  mlog(`... code = ${code} ...`);

  mlog('3: confirming email with given code');
  await Auth.confirmSignUp(username, code);

  mlog('... returning Cognito User ...');
  return await adminFindUserByEmail(envars.COGNITO_POOLID, email);
};

export const signIn = async (
  email: string,
  password: string,
  silent = false,
): Promise<{ userId: string; token: string }> => {
  if (!silent) {
    mlog(`1: signing in: ${email}`);
  }
  const user = await Auth.signIn({ username: email, password });
  if (!user) {
    throw new Error('cannot signIn');
  }

  const { username } = user;
  if (!username) {
    throw new Error('cannot extract username');
  }

  if (!silent) {
    mlog('2: getting current session');
  }
  const session = await Auth.currentSession();
  const token = session.getIdToken().getJwtToken();

  // results
  return { userId: username, token };
};
