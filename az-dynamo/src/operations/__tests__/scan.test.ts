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
    endpoint: 'http://localhost:8008',
  },
});

const tableName = 'TEST-AZDYN-USERS';

describe('scan operation', () => {
  it('should return the NAME data of all users', async () => {
    const res = await scan(tableName, 'aspect', 'NAME');
    res.sort(sortAlpha);
    expect(res).toEqual([
      {
        itemId: 'scan.1',
        indexSK: '2020-01-01T01:02:08Z',
        fullName: 'First Tester Bot',
        email: 'scan.1@operation.com',
        aspect: 'NAME',
      },
      {
        itemId: 'scan.2',
        indexSK: '2020-01-02T01:02:09Z',
        fullName: 'Second Tester Bot',
        email: 'scan.2@operation.com',
        aspect: 'NAME',
      },
      {
        itemId: 'scan.3',
        indexSK: '2020-01-03T01:02:10Z',
        fullName: 'Third Tester Bot',
        email: 'scan.3@operation.com',
        aspect: 'NAME',
      },
      {
        itemId: 'scan.4',
        indexSK: '2020-01-04T01:02:11Z',
        fullName: 'Fourth Tester Bot',
        email: 'scan.4@operation.com',
        aspect: 'NAME',
      },
      {
        itemId: 'scan.5',
        indexSK: '2020-01-05T01:02:12Z',
        fullName: 'Fifth Tester Bot',
        email: 'scan.5@operation.com',
        aspect: 'NAME',
      },
    ]);
  });
});
