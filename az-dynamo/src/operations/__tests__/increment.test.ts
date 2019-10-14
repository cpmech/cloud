import AWS from 'aws-sdk';
import { increment } from '../increment';
import { any2updateData } from '../../util';

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
    .update({
      TableName: TABLE_USERS,
      Key: { email: 'increment@operation.com', aspect: 'ACCESS' },
      ...any2updateData({ confirmMessageCount: 3 }),
    })
    .promise();
});

describe('increment operation', () => {
  describe(`${TABLE_USERS} table`, () => {
    it('should increment confirmMessageCount by 1)', async () => {
      const key = { email: 'increment@operation.com', aspect: 'ACCESS' };
      await increment(TABLE_USERS, key, 'confirmMessageCount');
      const res = await ddb.get({ TableName: TABLE_USERS, Key: key }).promise();
      expect(res.Item).toEqual({
        ...key,
        fullName: 'Tester Bot',
        confirmed: true,
        confirmMessageCount: 4,
      });
    });

    it('should increment confirmMessageCount by 3)', async () => {
      const key = { email: 'increment@operation.com', aspect: 'ACCESS' };
      await increment(TABLE_USERS, key, 'confirmMessageCount', 3);
      const res = await ddb.get({ TableName: TABLE_USERS, Key: key }).promise();
      expect(res.Item).toEqual({
        ...key,
        fullName: 'Tester Bot',
        confirmed: true,
        confirmMessageCount: 6,
      });
    });
  });
});
