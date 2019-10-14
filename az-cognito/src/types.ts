import AWS from 'aws-sdk';

export type ICognitoUserType = AWS.CognitoIdentityServiceProvider.UserType;

export interface ICognitoUser extends Omit<ICognitoUserType, 'Attributes'> {
  Data: {
    [key: string]: string;
  };
}
