import { CognitoUser, CognitoUserAttribute, UserData } from 'amazon-cognito-identity-js';

export const getUserAttributes = (user: CognitoUser): Promise<CognitoUserAttribute[]> =>
  new Promise((resolve, reject) => {
    if (!user) {
      return reject('user is null');
    }
    user.getUserAttributes((err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });

export const getUserData = (user: CognitoUser): Promise<UserData> =>
  new Promise((resolve, reject) => {
    if (!user) {
      return reject('user is null');
    }
    user.getUserData((err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
