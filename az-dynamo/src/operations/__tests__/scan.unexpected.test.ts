import { scan } from '../scan';

const fakePromise = {
  promise: jest.fn(),
};

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      scan: () => fakePromise,
    })),
  },
}));

const tableName = 'TEST-AZDYN-USERS';

describe('unexpected query operation', () => {
  it('should return empty list on an unexpected situation', async () => {
    fakePromise.promise.mockImplementation(() => Promise.resolve({}));
    const r1 = await scan(tableName, 'aspect', 'NAME');
    const r2 = await scan(tableName, 'aspect', 'NAME', undefined, 'between', 'Z');
    expect(r1).toEqual([]);
    expect(r2).toEqual([]);
  });

  it('should throw error due to LastEvaluatedKey', async () => {
    fakePromise.promise.mockImplementation(() => Promise.resolve({ LastEvaluatedKey: 'somekey' }));
    await expect(scan(tableName, 'aspect', 'NAME')).rejects.toThrowError(
      'cannot handle partial results just yet',
    );
  });
});
