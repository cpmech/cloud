import AWS from 'aws-sdk';
import { get } from '../get';

AWS.config.update({
  region: 'us-east-1',
  dynamodb: {
    endpoint: 'http://localhost:8008',
  },
});

const tableName = 'TEST-AZDYN-USERS';

describe('get operation', () => {
  it('should get ACCESS data', async () => {
    const key = { itemId: 'get', aspect: 'ACCESS' };
    const res = await get(tableName, key);
    expect(res).toEqual({
      ...key,
      indexSK: '2020-01-19T01:02:01Z',
      email: 'get@operation.com',
      fullName: 'Tester Bot',
      confirmed: true,
      confirmMessageCount: 3,
    });
  });

  it('should get LOCATION data', async () => {
    const key = { itemId: 'get', aspect: 'LOCATION' };
    const res = await get(tableName, key);
    expect(res).toEqual({
      ...key,
      indexSK: '2020-01-19T01:02:02Z',
      description: 'A Very Nice Place',
      coordinates: { x: 1.1, y: 2.2, z: 3.3 },
    });
  });

  it('should return {} on wrong email', async () => {
    const key = { itemId: 'inexistent', aspect: 'LOCATION' };
    const res = await get(tableName, key);
    expect(res).toBeNull();
  });

  it('should return {} on wrong key', async () => {
    const key = { itemId: 'get', aspect: '__INEXISTENT__' };
    const res = await get(tableName, key);
    expect(res).toBeNull();
  });
});
