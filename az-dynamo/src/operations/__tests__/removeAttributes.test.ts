import AWS from 'aws-sdk';
import { removeAttributes } from '../removeAttributes';

AWS.config.update({
  region: 'us-east-1',
  dynamodb: {
    endpoint: 'http://localhost:8008',
  },
});

const tableName = 'TEST-AZDYN-USERS';
const ddb = new AWS.DynamoDB.DocumentClient();

describe('removeAttributes operation', () => {
  it('should remove ACCESS attributes from table', async () => {
    const key = { itemId: 'removeAttributes', aspect: 'ACCESS' };
    await removeAttributes(tableName, key, ['fullName', 'confirmed']);
    const res = await ddb.get({ TableName: tableName, Key: key }).promise();
    expect(res.Item).toEqual({
      ...key,
      indexSK: '2020-01-19T01:02:04Z',
      email: 'removeAttributes@operation.com',
      confirmMessageCount: 3,
    });
  });
});
