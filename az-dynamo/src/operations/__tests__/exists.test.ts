import AWS from 'aws-sdk';
import { exists } from '../exists';

AWS.config.update({
  region: 'us-east-1',
  dynamodb: {
    endpoint: 'http://localhost:8008',
  },
});

const tableName = 'TEST-AZDYN-USERS';

describe('exists operation', () => {
  it('should return true for existent data', async () => {
    const key = { itemId: 'exists', aspect: 'ACCESS' };
    const res = await exists(tableName, key);
    expect(res).toBeTruthy();
  });

  it('should return false for inexistent data', async () => {
    const key = { itemId: 'does.not.exist', aspect: 'ACCESS' };
    const res = await exists(tableName, key);
    expect(res).toBeFalsy();
  });
});
