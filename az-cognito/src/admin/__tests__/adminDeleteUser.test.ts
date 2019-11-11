import { adminDeleteUser } from '../adminDeleteUser';

const fakePromise = {
  promise: jest.fn(),
};

jest.mock('aws-sdk', () => ({
  CognitoIdentityServiceProvider: jest.fn(() => ({
    adminDeleteUser: () => fakePromise,
  })),
}));

const POOL_ID = 'us-east-1_asdfsa8';
const USERNAME = 'd3112a30343c3-3846495e5-5a5d505d51ed';

describe('adminDeleteUser', () => {
  it('should delete user', async () => {
    const res = await adminDeleteUser(POOL_ID, USERNAME);
    expect(fakePromise.promise).toBeCalledTimes(1);
  });
});
