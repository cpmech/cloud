import { Iany, cloneSimple, hasProp } from '@cpmech/basic';
import { sendEmail } from '@cpmech/az-senqs';
import { adminAddUserToGroup, adminSetAttributes } from '@cpmech/az-cognito';
import { update } from '@cpmech/az-dynamo';
import { any2type } from '@cpmech/js2ts';
import { defaultEmailMaker } from './defaultEmailMaker';
import { IEmailMaker } from './types';
import { ILambdaCognito, IEventCognito } from '../types';
import { unixTimeNow } from '../helpers';

// defaultData must be a simple object with at least three fields:
// {
//    userId: string;
//    aspect: string;
//    email: string;
// }

const setAccessInUsersTable = async (
  tableUsers: string,
  defaultData: Iany,
  userId: string,
  email: string,
) => {
  const { aspect } = defaultData;
  if (!aspect) {
    throw new Error(
      `aspect must be given in defaultData =\n${JSON.stringify(defaultData, undefined, 2)}`,
    );
  }
  const inputData = cloneSimple(defaultData);
  inputData.userId = userId;
  inputData.email = email;
  if (hasProp(inputData, 'createdAt')) {
    inputData.createdAt = unixTimeNow();
  }
  if (hasProp(inputData, 'unixCreatedAt')) {
    inputData.unixCreatedAt = unixTimeNow();
  }
  delete inputData.userId;
  delete inputData.aspect;
  const primaryKey = { userId, aspect };
  const newData = await update(tableUsers, primaryKey, inputData);
  const res = any2type(inputData, newData);
  if (!res) {
    throw new Error(`database is damaged`);
  }
};

export const makeCognitoPostConfirmHandler = (
  defaultUserGroup?: string,
  senderEmail?: string,
  verbose = false,
  emailMaker?: IEmailMaker,
  tableUsers?: string,
  defaultData?: Iany,
): ILambdaCognito => async (event: IEventCognito): Promise<any> => {
  const { userName } = event;
  const { email, name } = event.request.userAttributes;
  if (verbose) {
    console.log('... event ...');
    console.log(event);
  }

  // check
  if (!userName) {
    if (verbose) {
      console.log('[ERROR] cannot get userName from event data');
    }
    throw new Error('cannot get userName from event data');
  }
  if (!email) {
    if (verbose) {
      console.log('[ERROR] cannot get email from event data');
    }
    throw new Error('cannot get email from event data');
  }

  // status
  const status = event.request.userAttributes['cognito:user_status'];
  let provider;
  if (status === 'EXTERNAL_PROVIDER') {
    provider = userName.split('_')[0];
    if (verbose) {
      console.log(`... account created with ${provider} credentials ...`);
    }
  }

  // set dynamodb table
  if (tableUsers && defaultData) {
    if (verbose) {
      console.log('... setting access in user table ...');
    }
    await setAccessInUsersTable(tableUsers, defaultData, userName, email);
  }

  // add user to group
  if (defaultUserGroup) {
    if (verbose) {
      console.log('... adding user to group ...');
    }
    await adminAddUserToGroup(event.userPoolId, userName, defaultUserGroup, verbose);
  }

  // set email_verified attribute
  if (status === 'EXTERNAL_PROVIDER') {
    if (verbose) {
      console.log('... setting email_verified attribute ...');
    }
    await adminSetAttributes(event.userPoolId, userName, { email_verified: 'true' });
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
  if (verbose) {
    console.log('... done ...');
  }
  return event;
};
