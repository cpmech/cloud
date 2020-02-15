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

const table = 'TEST-AZDYN-USERS';

describe('unexpected query operation', () => {
  it('should return empty list on an unexpected situation', async () => {
    fakePromise.promise.mockImplementation(() => Promise.resolve({}));
    const r1 = await query({ table, pkName: 'itemId', pkValue: 'get' });
    const r2 = await query({
      table,
      pkName: 'itemId',
      pkValue: 'get',
      skName: 'aspect',
      skValue: 'LOCATION',
    });
    const r3 = await query({
      table,
      pkName: 'itemId',
      pkValue: 'get',
      skName: 'aspect',
      skValue: 'X',
      skValue2: 'Z',
      op: 'between',
    });
    expect(r1).toEqual([]);
    expect(r2).toEqual([]);
    expect(r3).toEqual([]);
  });

  it('should throw error due to LastEvaluatedKey', async () => {
    fakePromise.promise.mockImplementation(() => Promise.resolve({ LastEvaluatedKey: 'somekey' }));
    await expect(query({ table, pkName: 'itemId', pkValue: 'get' })).rejects.toThrowError(
      'cannot handle partial results just yet',
    );
  });
});
