import AWS from 'aws-sdk';
import { removeItem } from '../removeItem';
import { exists } from '../exists';

AWS.config.update({
  region: 'us-east-1',
  dynamodb: {
    endpoint: 'http://localhost:8001',
  },
});

const TABLE_USERS = 'TEST_AZDB_USERS';
const ddb = new AWS.DynamoDB.DocumentClient();

describe('removeItem operation', () => {
  describe(`${TABLE_USERS} table`, () => {
    it('should removes the whole ACCESS item from table', async () => {
      const key = { email: 'removeItem@operation.com', aspect: 'ACCESS' };
      await removeItem(TABLE_USERS, key);
      const res = await ddb.get({ TableName: TABLE_USERS, Key: key }).promise();
      expect(res).toEqual({});
      const x = await exists(TABLE_USERS, key);
      expect(x).toBeFalsy();
    });
  });
});
