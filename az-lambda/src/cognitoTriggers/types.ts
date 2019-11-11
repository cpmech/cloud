export interface IAccess {
  userId: string;
  aspect: 'ACCESS';
  role: string;
  email: string;
}

export const newAccess = (): IAccess => ({
  userId: '',
  aspect: 'ACCESS',
  role: '',
  email: '',
});

export interface IEmailMakerResults {
  subject: string;
  message: string;
}

export type IEmailMaker = (email: string, name?: string, provider?: string) => IEmailMakerResults;
