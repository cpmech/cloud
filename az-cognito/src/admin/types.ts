import AWS from 'aws-sdk';

export type ICognitoUserType = AWS.CognitoIdentityServiceProvider.UserType;

export type IAdminUserResponse = AWS.CognitoIdentityServiceProvider.AdminGetUserResponse;

export interface ICognitoUser extends Omit<ICognitoUserType, 'Attributes'> {
  Data: {
    [key: string]: string;
  };
}

export interface IUserInput {
  email: string;
  password: string;
  groups: string; // comma-separated
}

export const newUserInput = (): IUserInput => ({
  email: '',
  password: '',
  groups: '',
});
