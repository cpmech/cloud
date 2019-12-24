import AWS from 'aws-sdk';
import { create } from '../create';

AWS.config.update({
  region: 'us-east-1',
  dynamodb: {
    endpoint: 'http://localhost:8001',
  },
});

const TABLE_USERS = 'TEST_AZDB_USERS';
const ddb = new AWS.DynamoDB.DocumentClient();

beforeEach(async () => {
  await ddb
    .delete({
      TableName: TABLE_USERS,
      Key: { email: 'create@operation.com', aspect: 'ACCESS' },
    })
    .promise();
});

describe('create operation', () => {
  describe(`${TABLE_USERS} table`, () => {
    it('should create ACCESS data', async () => {
      const key = { email: 'create@operation.com', aspect: 'ACCESS' };
      const created = await create(TABLE_USERS, key, { a: 1, b: 2, c: { d: { e: 3 } } });
      const correct = {
        ...key,
        a: 1,
        b: 2,
        c: { d: { e: 3 } },
      };
      expect(created).toEqual(correct);
      const res = await ddb.get({ TableName: TABLE_USERS, Key: key }).promise();
      expect(res.Item).toEqual(correct);
    });
  });

  describe(`${TABLE_USERS} table`, () => {
    it('should throw error on existent item', async () => {
      const key = { email: 'create@operation.com', aspect: 'ACCESS' };
      const created = await create(TABLE_USERS, key, { a: 'a' });
      expect(created).toEqual({ ...key, a: 'a' });
      await expect(create(TABLE_USERS, key, { a: 'a' })).rejects.toThrowError(
        `item with key = {"email":"create@operation.com","aspect":"ACCESS"} exists already`,
      );
    });
  });
});
