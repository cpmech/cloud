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

const tableName = 'TEST-AZDYN-USERS';

describe('unexpected update operation', () => {
  it('should return null error on failed update', async () => {
    fakePromise.promise.mockImplementation(() => Promise.resolve({}));
    const key = { itemId: 'update', aspect: 'ACCESS' };
    const res = await update(tableName, key, { fullName: 'Unexpected' });
    expect(res).toBeNull();
  });
});
