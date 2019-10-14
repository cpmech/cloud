import { update } from '../update';

const fakePromise = {
  promise: jest.fn(),
};

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      update: () => fakePromise,
    })),
  },
}));

const TABLE_USERS = 'TEST_AZDB_USERS';

describe('unexpected update operation', () => {
  describe(`${TABLE_USERS} table`, () => {
    it('should return null error on failed update', async () => {
      fakePromise.promise.mockImplementation(() => Promise.resolve({}));
      const key = { email: 'update@operation.com', aspect: 'ACCESS' };
      const res = await update(TABLE_USERS, key, { fullName: 'Unexpected' });
      expect(res).toBeNull();
    });
  });
});
