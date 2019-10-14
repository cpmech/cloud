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

const TABLE_PARAMS = 'TEST_AZDB_PARAMS';

describe('unexpected query operation', () => {
  describe(`${TABLE_PARAMS} table`, () => {
    it('should return empty list on an unexpected situation', async () => {
      fakePromise.promise.mockImplementation(() => Promise.resolve({}));
      const res = await query(TABLE_PARAMS, 'category', 'calcInfo', 'brState', 'DF');
      expect(res).toEqual([]);
    });
  });
});
