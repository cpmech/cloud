import { getMany } from '../getMany';

const fakePromise = {
  promise: jest.fn(),
};

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      batchGet: () => fakePromise,
    })),
  },
}));

const tableName = 'TEST-AZDYN-USERS';

describe('getMany_unexpected', () => {
  it('should fail due to UnprocessedKeys items', async () => {
    fakePromise.promise.mockImplementation(() =>
      Promise.resolve({ UnprocessedKeys: { [tableName]: {} } }),
    );
    const keys = [{ itemId: '101', aspect: 'PRODUCT' }];
    await expect(getMany(tableName, keys)).rejects.toThrowError(
      'getMany: cannot handle unprocessed keys at this time',
    );
  });

  it('should return empty list', async () => {
    fakePromise.promise.mockImplementation(() => Promise.resolve({}));
    const keys = [{ itemId: '101', aspect: 'PRODUCT' }];
    const res = await getMany(tableName, keys);
    expect(res).toEqual([]);
  });
});
