import { updateMany } from '../updateMany';

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

describe('unexpected updateMany operation', () => {
  it('should return null error on failed update', async () => {
    fakePromise1.promise.mockImplementation(() => Promise.resolve({}));
    fakePromise2.promise.mockImplementation(() => Promise.resolve({}));
    const key = { itemId: 'updateMany', aspect: 'DATA' };
    const r1 = await updateMany([{ table: tableName, primaryKey: key, data: {} }]);
    expect(r1).toEqual([]);
    fakePromise2.promise.mockImplementation(() => Promise.resolve({ Responses: [{}] }));
    const r2 = await updateMany([{ table: tableName, primaryKey: key, data: {} }]);
    expect(r2).toEqual([{}]);
  });
});
