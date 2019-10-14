import AWS from 'aws-sdk';
import { removeAttributes } from '../removeAttributes';

AWS.config.update({
  region: 'us-east-1',
  dynamodb: {
    endpoint: 'http://localhost:8001',
  },
});

const TABLE_USERS = 'TEST_AZDB_USERS';
const ddb = new AWS.DynamoDB.DocumentClient();

describe('removeAttributes operation', () => {
  describe(`${TABLE_USERS} table`, () => {
    it('should remove ACCESS attributes from table', async () => {
      const key = { email: 'removeAttributes@operation.com', aspect: 'ACCESS' };
      await removeAttributes(TABLE_USERS, key, ['fullName', 'confirmed']);
      const res = await ddb.get({ TableName: TABLE_USERS, Key: key }).promise();
      expect(res.Item).toEqual({
        ...key,
        confirmMessageCount: 3,
      });
    });
  });
});
