import { updateT } from '../updateT';

const fakePromise1 = { promise: jest.fn() };
const fakePromise2 = { promise: jest.fn() };

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      transactWrite: () => fakePromise1,
      transactGet: () => fakePromise2,
    })),
  },
}));

const tableName = 'TEST-AZDYN-USERS';

describe('unexpected updateT operation', () => {
  it('should return null error on failed update', async () => {
    fakePromise1.promise.mockImplementation(() => Promise.resolve({}));
    fakePromise2.promise.mockImplementation(() => Promise.resolve({}));
    const key = { itemId: 'updateT', aspect: 'DATA' };
    const r1 = await updateT([{ table: tableName, primaryKey: key, data: {} }], true);
    expect(r1).toEqual([]);
    fakePromise2.promise.mockImplementation(() => Promise.resolve({ Responses: [{}] }));
    const r2 = await updateT([{ table: tableName, primaryKey: key, data: {} }], true);
    expect(r2).toEqual([{}]);
  });
});
