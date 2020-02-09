export interface IEmailMakerResults {
  subject: string;
  message: string;
}

export type IEmailMaker = (
  email: string,
  name?: string,
  federationProvider?: string,
) => IEmailMakerResults;

export const defaultEmailMaker: IEmailMaker = (
  email: string,
  name?: string,
  federationProvider?: string,
): IEmailMakerResults => {
  let message = `Hello ${name ? name : email},

Your account has been created successfully.

Enjoy!
`;
  if (federationProvider) {
    message += `
(account created with ${federationProvider} credentials)
  `;
  }

  return {
    subject: 'Welcome!',
    message,
  };
};
