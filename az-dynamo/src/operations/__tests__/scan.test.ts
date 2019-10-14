import AWS from 'aws-sdk';
import { scan } from '../scan';
import { Iany } from '@cpmech/js2ts';

interface IEntry {
  fullName: string;
  email: string;
}

const sortAlpha = (a: Iany, b: Iany): number => {
  const A = a as IEntry;
  const B = b as IEntry;
  if (A.email < B.email) {
    return -1;
  }
  if (A.email > B.email) {
    return +1;
  }
  return 0;
};

AWS.config.update({
  region: 'us-east-1',
  dynamodb: {
    endpoint: 'http://localhost:8001',
  },
});

const TABLE_USERS = 'TEST_AZDB_USERS';

describe('scan operation', () => {
  describe(`${TABLE_USERS} table`, () => {
    it('should return the NAME data of all users', async () => {
      const res = await scan(TABLE_USERS, 'aspect', 'NAME');
      res.sort(sortAlpha);
      expect(res).toEqual([
        {
          fullName: 'First Tester Bot',
          email: 'scan.1@operation.com',
          aspect: 'NAME',
        },
        {
          fullName: 'Second Tester Bot',
          email: 'scan.2@operation.com',
          aspect: 'NAME',
        },
        {
          fullName: 'Third Tester Bot',
          email: 'scan.3@operation.com',
          aspect: 'NAME',
        },
        {
          fullName: 'Fourth Tester Bot',
          email: 'scan.4@operation.com',
          aspect: 'NAME',
        },
        {
          fullName: 'Fifth Tester Bot',
          email: 'scan.5@operation.com',
          aspect: 'NAME',
        },
      ]);
    });
  });
});
