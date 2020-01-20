import AWS from 'aws-sdk';
import { tableExists, tableIsActive } from '../table';

AWS.config.update({
  region: 'us-east-1',
  dynamodb: {
    endpoint: 'http://localhost:8008',
  },
});

const tableName = 'TEST-AZDYN-USERS';

describe('tables', () => {
  it('tableExists should return true', async () => {
    const res = await tableExists(tableName);
    expect(res).toBeTruthy();
  });

  it('tableIsActive should return true', async () => {
    const res = await tableIsActive(tableName);
    expect(res).toBeTruthy();
  });
});
