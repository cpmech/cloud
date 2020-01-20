import { tableExists, tableIsActive } from '../table';

const fakePromise = {
  promise: jest.fn(),
};

jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    describeTable: () => fakePromise,
  })),
}));

const tableName = 'TEST-AZDYN-USERS';

describe('tables (unexpected errors)', () => {
  it('tableExists should return false', async () => {
    fakePromise.promise.mockImplementation(() => Promise.resolve({}));
    const res = await tableExists(tableName);
    expect(res).toBeFalsy();
  });

  it('tableIsActive should return true', async () => {
    fakePromise.promise.mockImplementation(() => Promise.resolve({}));
    const res = await tableIsActive(tableName);
    expect(res).toBeFalsy();
  });
});
