import { IEmailMaker, IEmailMakerResults } from './types';

export const defaultEmailMaker: IEmailMaker = (
  email: string,
  name?: string,
  provider?: string,
): IEmailMakerResults => {
  let message = `Hello ${name ? name : email},

Your account has been created successfully.

Enjoy!
`;
  if (provider) {
    message += `
(account created with ${provider} credentials)
  `;
  }

  return {
    subject: 'Welcome!',
    message,
  };
};
