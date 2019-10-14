import { create } from '../create';

const fakePromise = {
  promise: jest.fn(),
};

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      get: () => fakePromise,
      put: () => fakePromise,
    })),
  },
}));

const TABLE_USERS = 'TEST_AZDB_USERS';

describe('unexpected create operation', () => {
  describe(`${TABLE_USERS} table`, () => {
    it('should throw error on failed create', async () => {
      fakePromise.promise.mockImplementation(() => Promise.resolve({}));
      const key = { email: 'create.with.error@operation.com', aspect: 'ACCESS' };
      await expect(create(TABLE_USERS, key, { fullName: 'Unexpected' })).rejects.toThrowError(
        'DynamoDB create failed with no results',
      );
    });
  });
});
