import AWS from 'aws-sdk';
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

const TABLE_USERS = 'TEST_AZDB_USERS';

describe('unexpected query operation', () => {
  describe(`${TABLE_USERS} table`, () => {
    it('should return empty list on an unexpected situation', async () => {
      fakePromise.promise.mockImplementation(() => Promise.resolve({}));
      const res = await scan(TABLE_USERS, 'aspect', 'NAME');
      expect(res).toEqual([]);
    });
  });
});
