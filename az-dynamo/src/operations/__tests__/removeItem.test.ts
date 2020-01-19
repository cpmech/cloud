import AWS from 'aws-sdk';
import { removeItem } from '../removeItem';
import { exists } from '../exists';

AWS.config.update({
  region: 'us-east-1',
  dynamodb: {
    endpoint: 'http://localhost:8008',
  },
});

const tableName = 'TEST-AZDYN-USERS';
const ddb = new AWS.DynamoDB.DocumentClient();

describe('removeItem operation', () => {
  it('should removes the whole ACCESS item from table', async () => {
    const key = { itemId: 'removeItem', aspect: 'ACCESS' };
    await removeItem(tableName, key);
    const res = await ddb.get({ TableName: tableName, Key: key }).promise();
    expect(res).toEqual({});
    const x = await exists(tableName, key);
    expect(x).toBeFalsy();
  });
});
