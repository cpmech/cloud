import AWS from 'aws-sdk';
import { query } from '../query';
import { calcInfoDF, calcInfoGO } from './samples';

AWS.config.update({
  region: 'us-east-1',
  dynamodb: {
    endpoint: 'http://localhost:8001',
  },
});

const TABLE_PARAMS = 'TEST_AZDB_PARAMS';

describe('query operation', () => {
  describe(`${TABLE_PARAMS} table`, () => {
    it('should return all calcInfo data', async () => {
      const res = await query(TABLE_PARAMS, 'category', 'calcInfo');
      expect(res).toEqual([calcInfoDF, calcInfoGO]);
    });

    it('should return DF calcInfo data', async () => {
      const res = await query(TABLE_PARAMS, 'category', 'calcInfo', 'brState', 'DF');
      expect(res).toEqual([calcInfoDF]);
    });

    it('should return empty list on inexistent partition key', async () => {
      const res = await query(TABLE_PARAMS, 'category', '__INEXISTENT__', 'brState', 'DF');
      expect(res).toEqual([]);
    });

    it('should return empty list on inexistent sort key', async () => {
      const res = await query(TABLE_PARAMS, 'category', 'calcInfo', 'brState', '__INEXISTENT__');
      expect(res).toEqual([]);
    });
  });
});
