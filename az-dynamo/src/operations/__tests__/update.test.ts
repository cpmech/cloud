import AWS from 'aws-sdk';
import { update } from '../update';

AWS.config.update({
  region: 'us-east-1',
  dynamodb: {
    endpoint: 'http://localhost:8001',
  },
});

const TABLE_USERS = 'TEST_AZDB_USERS';
const ddb = new AWS.DynamoDB.DocumentClient();

describe('update operation', () => {
  describe(`${TABLE_USERS} table`, () => {
    it('should update ACCESS data', async () => {
      const key = { email: 'update@operation.com', aspect: 'ACCESS' };
      const updated = await update(TABLE_USERS, key, { fullName: 'Tob Retset', confirmed: false });
      const correct = {
        ...key,
        fullName: 'Tob Retset',
        confirmed: false,
        confirmMessageCount: 3,
      };
      expect(updated).toEqual(correct);
      const res = await ddb.get({ TableName: TABLE_USERS, Key: key }).promise();
      expect(res.Item).toEqual(correct);
    });

    it('should update LOCATION data', async () => {
      const key = { email: 'update@operation.com', aspect: 'LOCATION' };
      const coordinates = {
        x: 100,
        // <<< removing y and z
      };
      const updated = await update(TABLE_USERS, key, { description: 'Earth', coordinates });
      const correct = {
        ...key,
        description: 'Earth',
        coordinates: {
          x: 100,
        },
      };
      expect(updated).toEqual(correct);
      const res = await ddb.get({ TableName: TABLE_USERS, Key: key }).promise();
      expect(res.Item).toEqual(correct);
    });

    it('should create new ACCESS data, if non-existent', async () => {
      const key = { email: 'update.create@operation.com', aspect: 'ACCESS' };
      const updated = await update(TABLE_USERS, key, {
        // <<<<<<<<<<<<<<<<<<<<<<< must remove the key to call the update
        fullName: 'New Robot',
        confirmed: true,
        confirmMessageCount: 8,
      });
      const correct = {
        ...key,
        fullName: 'New Robot',
        confirmed: true,
        confirmMessageCount: 8,
      };
      expect(updated).toEqual(correct);
      const res = await ddb.get({ TableName: TABLE_USERS, Key: key }).promise();
      expect(res.Item).toEqual(correct);
    });

    it('should do nothing if input data is empty', async () => {
      const key = { email: 'update@operation.com', aspect: 'ACCESS' };
      const res = await update(TABLE_USERS, key, {});
      expect(res).toBeNull();
    });
  });
});
