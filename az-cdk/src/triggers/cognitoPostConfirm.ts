import { ILambdaCognito, IEventCognito } from '@cpmech/az-lambda';
import { sendEmail } from '@cpmech/az-senqs';
import { adminAddUserToGroup } from '@cpmech/az-cognito';
import { update } from '@cpmech/az-dynamo';
import { any2type } from '@cpmech/js2ts';
import { newAccess, IAccess, IEmailMaker } from './types';
import { defaultEmailMaker } from './defaultEmailMaker';

const refData = newAccess();

const setAccessInUsersTable = async (tableUsers: string, userId: string, email: string) => {
  const inputData: IAccess = {
    ...newAccess(),
    userId,
    email,
  };
  delete inputData.userId;
  delete inputData.aspect;
  const primaryKey = { userId, aspect: 'ACCESS' };
  const newData = await update(tableUsers, primaryKey, inputData);
  const res = any2type(refData, newData);
  if (!res) {
    throw new Error(`database is damaged`);
  }
};

export const makeCognitoPostConfirmHandler = (
  defaultUserGroup?: string,
  tableUsers?: string,
  senderEmail?: string,
  emailMaker?: IEmailMaker,
  verbose = false,
): ILambdaCognito => async (event: IEventCognito): Promise<any> => {
  const { userName } = event;
  const { email, name } = event.request.userAttributes;
  if (verbose) {
    console.log('>>> event = \n', JSON.stringify(event, undefined, 2));
  }

  // check
  if (!userName) {
    throw new Error('cannot get userName from event data');
  }
  if (!email) {
    throw new Error('cannot get email from event data');
  }

  // status
  const status = event.request.userAttributes['cognito:user_status'];
  let provider;
  if (status === 'EXTERNAL_PROVIDER') {
    provider = userName.split('_')[0];
    if (verbose) {
      console.log(`account created with ${provider} credentials`);
    }
  }

  // add user to group
  if (defaultUserGroup) {
    await adminAddUserToGroup(event.userPoolId, userName, defaultUserGroup, verbose);
  }

  // set dynamodb table
  if (tableUsers) {
    if (verbose) {
      console.log('... setting access in user table ...');
    }
    await setAccessInUsersTable(tableUsers, userName, email);
  }

  // send confirmation email
  if (senderEmail) {
    if (verbose) {
      console.log('... sending confirmation email ...');
    }
    const { subject, message } = emailMaker
      ? emailMaker(email, name, provider)
      : defaultEmailMaker(email, name, provider);
    await sendEmail(senderEmail, [email], subject, message);
  }

  // response
  return event;
};
