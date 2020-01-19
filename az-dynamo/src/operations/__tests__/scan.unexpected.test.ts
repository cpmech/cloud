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
    const res = await scan(tableName, 'aspect', 'NAME');
    expect(res).toEqual([]);
  });
});
