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

const table = 'TEST-AZDYN-USERS';

describe('unexpected query operation', () => {
  it('should return empty list on an unexpected situation', async () => {
    fakePromise.promise.mockImplementation(() => Promise.resolve({}));
    const r1 = await scan({ table, skName: 'aspect', skValue: 'NAME' });
    const r2 = await scan({
      table,
      skName: 'aspect',
      skValue: 'NAME',
      skValue2: 'Z',
      op: 'between',
    });
    expect(r1).toEqual([]);
    expect(r2).toEqual([]);
  });

  it('should throw error due to LastEvaluatedKey', async () => {
    fakePromise.promise.mockImplementation(() => Promise.resolve({ LastEvaluatedKey: 'somekey' }));
    await expect(scan({ table, skName: 'aspect', skValue: 'NAME' })).rejects.toThrowError(
      'cannot handle partial results just yet',
    );
  });
});
