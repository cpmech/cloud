import { query } from '../query';

const fakePromise = {
  promise: jest.fn(),
};

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      query: () => fakePromise,
    })),
  },
}));

const tableName = 'TEST-AZDYN-USERS';

describe('unexpected query operation', () => {
  it('should return empty list on an unexpected situation', async () => {
    fakePromise.promise.mockImplementation(() => Promise.resolve({}));
    const r1 = await query(tableName, 'itemId', 'get');
    const r2 = await query(tableName, 'itemId', 'get', 'aspect', 'LOCATION');
    const r3 = await query(tableName, 'itemId', 'get', 'aspect', 'X', undefined, 'between', 'Z');
    expect(r1).toEqual([]);
    expect(r2).toEqual([]);
    expect(r3).toEqual([]);
  });

  it('should throw error due to LastEvaluatedKey', async () => {
    fakePromise.promise.mockImplementation(() => Promise.resolve({ LastEvaluatedKey: 'somekey' }));
    await expect(query(tableName, 'itemId', 'get')).rejects.toThrowError(
      'cannot handle partial results just yet',
    );
  });
});
