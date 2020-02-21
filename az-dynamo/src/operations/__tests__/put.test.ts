import AWS from 'aws-sdk';
import { put } from '../put';

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
      .delete({ TableName: tableName, Key: { itemId: 'added1', aspect: 'SOMETHING' } })
      .promise();
    await ddb
      .delete({ TableName: tableName, Key: { itemId: 'added2', aspect: 'SOMETHING' } })
      .promise();
  } catch (_) {}
};

afterAll(async () => await cleanUp());

describe('put operation', () => {
  it('should add new SOMETHING data', async () => {
    const key1 = { itemId: 'added1', aspect: 'SOMETHING' };
    const key2 = { itemId: 'added2', aspect: 'SOMETHING' };
    await put(tableName, key1);
    await put(tableName, key2, { x: 123, y: 456, z: 666 });
    const added1 = await ddb.get({ TableName: tableName, Key: key1 }).promise();
    const added2 = await ddb.get({ TableName: tableName, Key: key2 }).promise();
    const correct1 = { ...key1 };
    const correct2 = { ...key2, x: 123, y: 456, z: 666 };
    expect(added1.Item).toEqual(correct1);
    expect(added2.Item).toEqual(correct2);

    // remove x,y,z from added2
    await put(tableName, key2);
    const added2b = await ddb.get({ TableName: tableName, Key: key2 }).promise();
    const correct2b = { ...key2 };
    expect(added2b.Item).toEqual(correct2b);
  });
});
