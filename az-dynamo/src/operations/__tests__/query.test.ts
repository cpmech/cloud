import AWS from 'aws-sdk';
import { query } from '../query';

AWS.config.update({
  region: 'us-east-1',
  dynamodb: {
    endpoint: 'http://localhost:8008',
  },
});

const tableName = 'TEST-AZDYN-USERS';

describe('query operation', () => {
  it('should return all aspects', async () => {
    const res = await query(tableName, 'itemId', 'get');
    expect(res).toEqual([
      {
        itemId: 'get',
        aspect: 'ACCESS',
        indexSK: '2020-01-19T01:02:01Z',
        email: 'get@operation.com',
        fullName: 'Tester Bot',
        confirmed: true,
        confirmMessageCount: 3,
      },
      {
        itemId: 'get',
        aspect: 'LOCATION',
        indexSK: '2020-01-19T01:02:02Z',
        description: 'A Very Nice Place',
        coordinates: { x: 1.1, y: 2.2, z: 3.3 },
      },
    ]);
  });

  it('should return only LOCATION aspect', async () => {
    const res = await query(tableName, 'itemId', 'get', 'aspect', 'LOCATION');
    expect(res).toEqual([
      {
        itemId: 'get',
        aspect: 'LOCATION',
        indexSK: '2020-01-19T01:02:02Z',
        description: 'A Very Nice Place',
        coordinates: { x: 1.1, y: 2.2, z: 3.3 },
      },
    ]);
  });

  it('should return empty list on inexistent keys', async () => {
    const r1 = await query(tableName, 'itemId', '__NADA__');
    const r2 = await query(tableName, 'itemId', '__NADA__', 'aspect', 'ACCESS');
    const r3 = await query(tableName, 'itemId', 'get', 'aspect', '__NADA__');
    expect(r1).toEqual([]);
    expect(r2).toEqual([]);
    expect(r3).toEqual([]);
  });
});
