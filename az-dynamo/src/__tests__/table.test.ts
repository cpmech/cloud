import AWS from 'aws-sdk';
import { tableExists } from '../table';

AWS.config.update({
  region: 'us-east-1',
  dynamodb: {
    endpoint: 'http://localhost:8008',
  },
});

const tableName = 'TEST-AZDYN-USERS';

describe('tableExists', () => {
  it('should return true', async () => {
    const res = await tableExists(tableName);
    expect(res).toBeTruthy();
  });
});
