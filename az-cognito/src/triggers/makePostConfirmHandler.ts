import { mlog, elog } from '@cpmech/basic';
import { sendEmail } from '@cpmech/az-senqs';
import { defaultEmailMaker, IEmailMaker } from './defaultEmailMaker';
import { IEventCognito, ILambdaCognito } from './types';
import { adminAddUserToGroup, adminSetAttributes } from '../admin';

export type IUpdateDb = (userName: string, email: string, name?: string) => Promise<void>;

export interface IPostConfirmInput {
  updateDb?: IUpdateDb; // function to update database
  defaultUserGroup?: string; // e.g. 'customers'
  senderEmail?: string; // e.g. 'admin@example.com'
  emailMaker?: IEmailMaker; // function to make emails
}

// makeCognitoPostConfirmHandler returns a lambda function to
// act as a post-confirm handler for Cognito
export const makeCognitoPostConfirmHandler = ({
  defaultUserGroup,
  senderEmail,
  emailMaker,
  updateDb,
}: IPostConfirmInput): ILambdaCognito => async (event: IEventCognito): Promise<any> => {
  // extract input
  const { userName } = event;
  const { email } = event.request.userAttributes;
  const name = event.request.userAttributes.name || undefined;
  mlog('... print(event) ...');
  mlog(event);

  // check userName and email ...');
  mlog('... checking userName and email ...');
  if (!userName) {
    throw new Error(elog('cannot get userName from event data'));
  }
  if (!email) {
    throw new Error(elog('cannot get email from event data'));
  }

  // extract status and federation provider
  mlog('... extracting status and federation provider ...');
  const status = event.request.userAttributes['cognito:user_status'];
  let provider;
  if (status === 'EXTERNAL_PROVIDER') {
    provider = userName.split('_')[0];
    mlog(`... account created with ${provider} credentials ...`);
  }

  // call updateDb function
  if (updateDb) {
    mlog('... calling updateDb function ...');
    await updateDb(userName, email, name);
  }

  // add user to group
  if (defaultUserGroup) {
    mlog(`... adding user to group ${defaultUserGroup} ...`);
    await adminAddUserToGroup(event.userPoolId, userName, defaultUserGroup);
  }

  // set email_verified attribute
  if (status === 'EXTERNAL_PROVIDER') {
    mlog('... setting email_verified attribute ...');
    await adminSetAttributes(event.userPoolId, userName, { email_verified: 'true' });
  }

  // send confirmation email
  if (senderEmail) {
    mlog('... sending confirmation email ...');
    const { subject, message } = emailMaker
      ? emailMaker(email, name, provider)
      : defaultEmailMaker(email, name, provider);
    await sendEmail(senderEmail, [email], subject, message);
  }

  // response
  mlog('... success ...');
  return event; // must return event
};
