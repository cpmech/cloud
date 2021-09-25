import { mlog, elog } from '@cpmech/basic';
import { sendEmail } from '@cpmech/az-senqs';
import { defaultEmailMaker, IEmailMaker } from './defaultEmailMaker';
import { IEventCognito, ILambdaCognito } from './types';
import { adminAddUserToGroup, adminSetAttributes } from '../admin';

export interface IPostConfirmUser {
  userName: string;
  email: string;
  name?: string;
}

export type IUpdateDb = (user: IPostConfirmUser) => Promise<void>;

export type ISelectGroup = (user: IPostConfirmUser) => string;

export interface IPostConfirmInput {
  addToGroup?: ISelectGroup; // e.g. ({email}) => email == 'me@me.com' ? 'awesome' : 'customers'
  emailMaker?: IEmailMaker; // function to make emails
  updateDb?: IUpdateDb; // function to update database
  senderEmail?: string; // e.g. 'admin@example.com'
}

// makeCognitoPostConfirmHandler returns a lambda function to
// act as a post-confirm handler for Cognito
export const makeCognitoPostConfirmHandler =
  ({ addToGroup, emailMaker, updateDb, senderEmail }: IPostConfirmInput): ILambdaCognito =>
  async (event: IEventCognito): Promise<any> => {
    // extract input
    const { userName } = event;
    const { email } = event.request.userAttributes;
    const name = event.request.userAttributes.name || undefined;
    mlog('... cognito post-confirm function ...');
    mlog({ event });

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

    // set post-confirm user data
    const user: IPostConfirmUser = { userName, email, name };
    mlog({ user });

    // add user to group
    if (addToGroup) {
      const group = addToGroup(user);
      if (!group) {
        throw new Error(elog('addToGroup must return a non-empty string'));
      }
      mlog(`... adding user to group ${group} ...`);
      await adminAddUserToGroup(event.userPoolId, userName, group);
    }

    // set email_verified attribute
    if (status === 'EXTERNAL_PROVIDER') {
      mlog('... external-provider: setting email_verified attribute ...');
      await adminSetAttributes(event.userPoolId, userName, { email_verified: 'true' });
    }

    // call updateDb function
    if (updateDb) {
      mlog('... calling updateDb ...');
      await updateDb(user);
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
