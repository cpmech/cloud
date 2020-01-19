import AWS from 'aws-sdk';
import { update } from '../update';

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
        Key: { itemId: 'update', aspect: 'ACCESS' },
        UpdateExpression: 'set #y = :x',
        ExpressionAttributeNames: { '#y': 'confirmMessageCount' },
        ExpressionAttributeValues: { ':x': 3 },
      })
      .promise();
  } catch (_) {}
};

afterAll(async () => await cleanUp());

describe('update operation', () => {
  it('should update ACCESS data', async () => {
    const key = { itemId: 'update', aspect: 'ACCESS' };
    const updated = await update(tableName, key, { fullName: 'Tob Retset', confirmed: false });
    const correct = {
      ...key,
      indexSK: '2020-01-19T01:02:06Z',
      email: 'update@operation.com',
      fullName: 'Tob Retset',
      confirmed: false,
      confirmMessageCount: 3,
    };
    expect(updated).toEqual(correct);
    const res = await ddb.get({ TableName: tableName, Key: key }).promise();
    expect(res.Item).toEqual(correct);
  });

  it('should update LOCATION data', async () => {
    const key = { itemId: 'update', aspect: 'LOCATION' };
    const coordinates = {
      x: 100,
      // <<< removing y and z
    };
    const updated = await update(tableName, key, { description: 'Earth', coordinates });
    const correct = {
      ...key,
      indexSK: '2020-01-19T01:02:07Z',
      description: 'Earth',
      coordinates: {
        x: 100,
      },
    };
    expect(updated).toEqual(correct);
    const res = await ddb.get({ TableName: tableName, Key: key }).promise();
    expect(res.Item).toEqual(correct);
  });

  it('should create new ACCESS data, if non-existent', async () => {
    const key = { itemId: 'update', aspect: 'ACCESS' };
    const updated = await update(tableName, key, {
      // <<<<<<<<<<<<<<<<<<<<<<< must remove the key to call the update
      fullName: 'New Robot',
      confirmed: true,
      confirmMessageCount: 8,
    });
    const correct = {
      ...key,
      indexSK: '2020-01-19T01:02:06Z',
      email: 'update@operation.com',
      fullName: 'New Robot',
      confirmed: true,
      confirmMessageCount: 8,
    };
    expect(updated).toEqual(correct);
    const res = await ddb.get({ TableName: tableName, Key: key }).promise();
    expect(res.Item).toEqual(correct);
  });

  it('should do nothing if input data is empty', async () => {
    const key = { itemId: 'update', aspect: 'ACCESS' };
    const res = await update(tableName, key, {});
    expect(res).toBeNull();
  });
});
