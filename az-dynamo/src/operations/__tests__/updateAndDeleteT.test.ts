import AWS from 'aws-sdk';
import { updateAndDeleteT } from '../updateAndDeleteT';

AWS.config.update({
  region: 'us-east-1',
  dynamodb: {
    endpoint: 'http://localhost:8008',
  },
});

const tableName = 'TEST-AZDYN-USERS';
const ddb = new AWS.DynamoDB.DocumentClient();

const keys = [0, 1, 2, 3].map(i => ({ itemId: `updateAndDelete-${i}`, aspect: 'UD_TEST' }));

const fixItem = async (i: number) => {
  await ddb
    .update({
      TableName: tableName,
      Key: keys[i],
      UpdateExpression: 'SET #y0 = :x0',
      ExpressionAttributeNames: { '#y0': 'indexSK' },
      ExpressionAttributeValues: { ':x0': `100${i}` },
    })
    .promise();
};

const cleanUp = async () => {
  try {
    await fixItem(0);
    await fixItem(1);
    await fixItem(2);
    await fixItem(3);
  } catch (_) {}
};

afterAll(async () => await cleanUp());

describe('updateAndDeleteT operation', () => {
  it('should update two items and delete other two at the same time', async () => {
    // check before
    const b0 = await ddb.get({ TableName: tableName, Key: keys[0] }).promise();
    const b1 = await ddb.get({ TableName: tableName, Key: keys[1] }).promise();
    const b2 = await ddb.get({ TableName: tableName, Key: keys[2] }).promise();
    const b3 = await ddb.get({ TableName: tableName, Key: keys[3] }).promise();
    [b0, b1, b2, b3].forEach((b, i) =>
      expect(b.Item).toEqual({ ...keys[i], indexSK: String(1000 + i) }),
    );

    // transaction
    await updateAndDeleteT(
      [
        { table: tableName, primaryKey: keys[0], data: { indexSK: 'updated-2000' } },
        { table: tableName, primaryKey: keys[1], data: { indexSK: 'updated-2001' } },
      ],
      [
        { table: tableName, primaryKey: keys[2] },
        { table: tableName, primaryKey: keys[3] },
      ],
    );

    // check after
    const a0 = await ddb.get({ TableName: tableName, Key: keys[0] }).promise();
    const a1 = await ddb.get({ TableName: tableName, Key: keys[1] }).promise();
    const a2 = await ddb.get({ TableName: tableName, Key: keys[2] }).promise();
    const a3 = await ddb.get({ TableName: tableName, Key: keys[3] }).promise();
    [a0, a1].forEach((a, i) =>
      expect(a.Item).toEqual({ ...keys[i], indexSK: 'updated-' + String(2000 + i) }),
    );
    [a2, a3].forEach(a => expect(a).toStrictEqual({}));
  });

  it('should throw error on wrong input', async () => {
    const itemsUpdate = [1, 2, 3, 4, 5, 6].map(i => ({
      table: tableName,
      primaryKey: { itemId: 'updateAndDeleteT', aspect: 'UD_TEST' },
      data: { indexSK: 'zzz' },
    }));
    const itemsDelete = [1, 2, 3, 4, 5, 6].map(i => ({
      table: tableName,
      primaryKey: { itemId: 'updateAndDeleteT', aspect: 'UD_TEST' },
    }));
    await expect(updateAndDeleteT([], [])).rejects.toThrowError(
      'the total number of items must be in [1, 10]',
    );
    await expect(updateAndDeleteT(itemsUpdate, itemsDelete)).rejects.toThrowError(
      'the total number of items must be in [1, 10]',
    );
  });
});
