import { CognitoUser, CognitoUserAttribute } from 'amazon-cognito-identity-js';

export const getUserAttributes = (user: CognitoUser): Promise<CognitoUserAttribute[]> =>
  new Promise((resolve, reject) => {
    if (!user) {
      return reject('user is null');
    }
    user.getUserAttributes((err, data) => {
      if (err) {
        return reject(err);
      }
      if (!data) {
        return reject("data is undefined");
      }
      return resolve(data);
    });
  });
