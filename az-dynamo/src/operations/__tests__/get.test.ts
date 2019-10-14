import AWS from 'aws-sdk';
import { get } from '../get';
import { calcInfoDF, calcInfoGO } from './samples';

AWS.config.update({
  region: 'us-east-1',
  dynamodb: {
    endpoint: 'http://localhost:8001',
  },
});

const TABLE_USERS = 'TEST_AZDB_USERS';
const TABLE_PARAMS = 'TEST_AZDB_PARAMS';

describe('get operation', () => {
  describe(`${TABLE_USERS} table`, () => {
    it('should get ACCESS data', async () => {
      const key = { email: 'get@operation.com', aspect: 'ACCESS' };
      const res = await get(TABLE_USERS, key);
      expect(res).toEqual({
        ...key,
        fullName: 'Tester Bot',
        confirmed: true,
        confirmMessageCount: 3,
      });
    });

    it('should get LOCATION data', async () => {
      const key = { email: 'get@operation.com', aspect: 'LOCATION' };
      const res = await get(TABLE_USERS, key);
      expect(res).toEqual({
        ...key,
        description: 'A Very Nice Place',
        coordinates: {
          x: 1.1,
          y: 2.2,
          z: 3.3,
        },
      });
    });

    it('should return {} on wrong email', async () => {
      const key = { email: 'inexistent@nada.zero', aspect: 'LOCATION' };
      const res = await get(TABLE_USERS, key);
      expect(res).toBeNull();
    });

    it('should return {} on wrong key', async () => {
      const key = { email: 'get@operation.com', aspect: '__INEXISTENT__' };
      const res = await get(TABLE_USERS, key);
      expect(res).toBeNull();
    });
  });

  describe(`${TABLE_PARAMS} table`, () => {
    it('should get DF data', async () => {
      const key = { category: 'calcInfo', brState: 'DF' };
      const res = await get(TABLE_PARAMS, key);
      expect(res).toEqual(calcInfoDF);
    });

    it('should get GO data', async () => {
      const key = { category: 'calcInfo', brState: 'GO' };
      const res = await get(TABLE_PARAMS, key);
      expect(res).toEqual(calcInfoGO);
    });

    it('should return {} on inexistent item', async () => {
      const key = { category: 'calcInfo', brState: 'SP' };
      const res = await get(TABLE_PARAMS, key);
      expect(res).toBeNull();
    });
  });
});
