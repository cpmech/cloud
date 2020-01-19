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
    const res = await query(tableName, 'itemId', 'get', 'aspect', 'LOCATION');
    expect(res).toEqual([]);
  });
});
