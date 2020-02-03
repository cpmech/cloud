import { getT } from '../getT';

const fakePromise = { promise: jest.fn() };

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      transactGet: () => fakePromise,
    })),
  },
}));

const tableName = 'TEST-AZDYN-USERS';

describe('unexpected updateT operation', () => {
  it('should return null error on failed update', async () => {
    fakePromise.promise.mockImplementation(() => Promise.resolve({}));
    const key = { itemId: 'getT', aspect: 'TOGET' };
    const r1 = await getT([{ table: tableName, primaryKey: key }]);
    expect(r1).toEqual([]);

    fakePromise.promise.mockImplementation(() => Promise.resolve({ Responses: [{}] }));
    const r2 = await getT([{ table: tableName, primaryKey: key }]);
    expect(r2).toEqual([{}]);
  });
});
