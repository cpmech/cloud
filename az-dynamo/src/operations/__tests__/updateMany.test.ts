import AWS from 'aws-sdk';
import { updateMany } from '../updateMany';

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
        Key: { itemId: 'updateMany', aspect: 'DATA' },
        UpdateExpression: 'SET #y0 = :x0, #y1 = :x1',
        ExpressionAttributeNames: { '#y0': 'indexSK', '#y1': 'message' },
        ExpressionAttributeValues: { ':x0': 'hello', ':x1': 'world' },
      })
      .promise();
    await ddb
      .update({
        TableName: tableName,
        Key: { itemId: 'updateMany', aspect: 'MORE_DATA' },
        UpdateExpression: 'SET #y0 = :x0, #y1 = :x1',
        ExpressionAttributeNames: { '#y0': 'indexSK', '#y1': 'value' },
        ExpressionAttributeValues: { ':x0': '123', ':x1': 456 },
      })
      .promise();
  } catch (_) {}
};

afterAll(async () => await cleanUp());

describe('updateMany operation', () => {
  it('should update two items at the same time', async () => {
    const key1 = { itemId: 'updateMany', aspect: 'DATA' };
    const key2 = { itemId: 'updateMany', aspect: 'MORE_DATA' };
    const before1 = await ddb.get({ TableName: tableName, Key: key1 }).promise();
    const before2 = await ddb.get({ TableName: tableName, Key: key2 }).promise();
    expect(before1.Item).toEqual({ ...key1, indexSK: 'hello', message: 'world' });
    expect(before2.Item).toEqual({ ...key2, indexSK: '123', value: 456 });
    const updated = await updateMany([
      { table: tableName, primaryKey: key1, data: { indexSK: 'just', message: 'changed' } },
      { table: tableName, primaryKey: key2, data: { indexSK: '666', value: -1000 } },
    ]);
    const correct = [
      {
        ...key1,
        indexSK: 'just',
        message: 'changed',
      },
      {
        ...key2,
        indexSK: '666',
        value: -1000,
      },
    ];
    expect(updated).toEqual(correct);
    const r1 = await ddb.get({ TableName: tableName, Key: key1 }).promise();
    const r2 = await ddb.get({ TableName: tableName, Key: key2 }).promise();
    expect(r1.Item).toEqual(correct[0]);
    expect(r2.Item).toEqual(correct[1]);
  });

  it('should update two items without response', async () => {
    const key1 = { itemId: 'updateMany', aspect: 'DATA' };
    const key2 = { itemId: 'updateMany', aspect: 'MORE_DATA' };
    const updated = await updateMany(
      [
        { table: tableName, primaryKey: key1, data: { indexSK: 'xxx', message: 'yyy' } },
        { table: tableName, primaryKey: key2, data: { indexSK: '000', value: 666 } },
      ],
      false,
    );
    expect(updated).toBeNull();
  });

  it('should throw error on wrong input', async () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => ({
      table: tableName,
      primaryKey: { itemId: 'updateMany', aspect: 'DATA' },
      data: { indexSK: 'zzz' },
    }));
    await expect(updateMany([])).rejects.toThrowError(
      'the number of items to update must in [1, 10]',
    );
    await expect(updateMany(items)).rejects.toThrowError(
      'the number of items to update must in [1, 10]',
    );
  });
});
