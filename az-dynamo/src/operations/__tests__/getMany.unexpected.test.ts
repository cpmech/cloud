import { getBatch } from '../getBatch';

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

describe('getBatch_unexpected', () => {
  it('should fail due to UnprocessedKeys items', async () => {
    fakePromise.promise.mockImplementation(() =>
      Promise.resolve({ UnprocessedKeys: { [tableName]: {} } }),
    );
    const keys = [{ itemId: '101', aspect: 'PRODUCT' }];
    await expect(getBatch(tableName, keys)).rejects.toThrowError(
      'getBatch: cannot handle unprocessed keys at this time',
    );
  });

  it('should return empty list', async () => {
    fakePromise.promise.mockImplementation(() => Promise.resolve({}));
    const keys = [{ itemId: '101', aspect: 'PRODUCT' }];
    const res = await getBatch(tableName, keys);
    expect(res).toEqual([]);
  });
});
