// EMPTY indicates that sting (in DynamoDB) is empty.
// NOTE that DynamoDB doesn't accept empty strings, that's why we need this
export const EMPTY = '__EMPTY__';

export interface IAccess {
  userId: string;
  aspect: 'ACCESS';
  role: string;
  email: string;
}

export const newAccess = (): IAccess => ({
  userId: EMPTY,
  aspect: 'ACCESS',
  role: 'NADA',
  email: EMPTY,
});

export interface IEmailMakerResults {
  subject: string;
  message: string;
}

export type IEmailMaker = (email: string, name?: string, provider?: string) => IEmailMakerResults;
