import AWS from 'aws-sdk';
import { increment } from '../increment';
import { any2updateData } from '../../util';

AWS.config.update({
  region: 'us-east-1',
  dynamodb: {
    endpoint: 'http://localhost:8008',
  },
});

const tableName = 'TEST-AZDYN-USERS';
const ddb = new AWS.DynamoDB.DocumentClient();

const cleanUp = async () => {
  try {
    await ddb
      .update({
        TableName: tableName,
        Key: { itemId: 'increment', aspect: 'ACCESS' },
        UpdateExpression: 'set #y = :x',
        ExpressionAttributeNames: { '#y': 'confirmMessageCount' },
        ExpressionAttributeValues: { ':x': 3 },
      })
      .promise();
  } catch (_) {}
};

afterAll(async () => await cleanUp());

describe('increment operation', () => {
  it('should increment confirmMessageCount by 1)', async () => {
    const key = { itemId: 'increment', aspect: 'ACCESS' };
    await increment(tableName, key, 'confirmMessageCount');
    const res = await ddb.get({ TableName: tableName, Key: key }).promise();
    expect(res.Item).toEqual({
      ...key,
      indexSK: '2020-01-19T01:02:03Z',
      email: 'increment@operation.com',
      fullName: 'Tester Bot',
      confirmed: true,
      confirmMessageCount: 4,
    });
  });

  it('should increment confirmMessageCount by 3)', async () => {
    const key = { itemId: 'increment', aspect: 'ACCESS' };
    await increment(tableName, key, 'confirmMessageCount', 3);
    const res = await ddb.get({ TableName: tableName, Key: key }).promise();
    expect(res.Item).toEqual({
      ...key,
      indexSK: '2020-01-19T01:02:03Z',
      email: 'increment@operation.com',
      fullName: 'Tester Bot',
      confirmed: true,
      confirmMessageCount: 7,
    });
  });
});
