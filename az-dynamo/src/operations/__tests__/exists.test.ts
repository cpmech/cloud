import AWS from 'aws-sdk';
import { exists } from '../exists';

AWS.config.update({
  region: 'us-east-1',
  dynamodb: {
    endpoint: 'http://localhost:8001',
  },
});

const TABLE_USERS = 'TEST_AZDB_USERS';
const TABLE_PARAMS = 'TEST_AZDB_PARAMS';

describe('exists operation', () => {
  describe(`${TABLE_USERS} table`, () => {
    it('should return true for existent data', async () => {
      const key = { email: 'exists@operation.com', aspect: 'ACCESS' };
      const res = await exists(TABLE_USERS, key);
      expect(res).toBeTruthy();
    });

    it('should return false for inexistent data', async () => {
      const key = { email: 'does.not.exist@operation.com', aspect: 'ACCESS' };
      const res = await exists(TABLE_USERS, key);
      expect(res).toBeFalsy();
    });
  });
});
