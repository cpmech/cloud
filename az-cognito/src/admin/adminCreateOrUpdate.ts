import AWS from 'aws-sdk';

export interface IUserInput {
  userId: string;
  email: string;
  group: string;
}

export const newUserInpit = (): IUserInput => ({
  userId: '',
  email: '',
  group: '',
});

const refUserInput = newUserInpit();

export const adminCreateOrUpdateUsers = async (
  poolId: string,
  users: IUserInput[],
  region: string = 'us-east-1',
) => {};
