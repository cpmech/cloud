import AWS from 'aws-sdk';
import { create } from '../create';

AWS.config.update({
  region: 'us-east-1',
  dynamodb: {
    endpoint: 'http://localhost:8008',
  },
});

const tableName = 'TEST-AZDYN-USERS';
const ddb = new AWS.DynamoDB.DocumentClient();

beforeEach(async () => {
  try {
    await ddb
      .delete({
        TableName: tableName,
        Key: { itemId: 'create', aspect: 'ACCESS' },
      })
      .promise();
  } catch (_) {}
});

describe('create operation', () => {
  it('should create ACCESS data', async () => {
    const key = { itemId: 'create', aspect: 'ACCESS' };
    const email = 'create@operation.com';
    const createdAt = new Date().toISOString();
    await create(tableName, key, {
      indexSK: createdAt,
      email,
      a: 1,
      b: 2,
      c: { d: { e: 3 } },
    });
    const correct = {
      ...key,
      indexSK: createdAt,
      email,
      a: 1,
      b: 2,
      c: { d: { e: 3 } },
    };
    const res = await ddb.get({ TableName: tableName, Key: key }).promise();
    expect(res.Item).toEqual(correct);
  });

  it('should throw error on existent item', async () => {
    const key = { itemId: 'create', aspect: 'ACCESS' };
    await create(tableName, key, { a: 'a' });
    await expect(create(tableName, key, { a: 'a' })).rejects.toThrowError(
      `item with key = {"itemId":"create","aspect":"ACCESS"} exists already`,
    );
  });
});
