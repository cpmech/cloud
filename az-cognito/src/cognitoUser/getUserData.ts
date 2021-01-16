import { CognitoUser, UserData } from 'amazon-cognito-identity-js';

export const getUserData = (user: CognitoUser): Promise<UserData> =>
  new Promise((resolve, reject) => {
    if (!user) {
      return reject('user is null');
    }
    user.getUserData((err, data) => {
      if (err) {
        return reject(err);
      }
      if (!data) {
        return reject("data is undefined");
      }
      return resolve(data);
    });
  });
