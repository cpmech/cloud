import { CognitoUser, CognitoIdToken } from 'amazon-cognito-identity-js';

export const getToken = (user: CognitoUser): CognitoIdToken => {
  if (!user) {
    throw new Error('user is null');
  }
  const session = user.getSignInUserSession();
  if (!session) {
    throw new Error('cannot get session of signed-in user');
  }
  return session.getIdToken();
};
