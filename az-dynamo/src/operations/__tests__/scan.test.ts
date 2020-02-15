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

const table = 'TEST-AZDYN-USERS';
const index = 'USERS-INDEX';

const s1 = {
  itemId: 'scan.1',
  indexSK: '2020-01-01T01:02:08Z',
  fullName: 'First Tester Bot',
  email: 'scan.1@operation.com',
  aspect: 'NAME',
};
const s2 = {
  itemId: 'scan.2',
  indexSK: '2020-01-02T01:02:09Z',
  fullName: 'Second Tester Bot',
  email: 'scan.2@operation.com',
  aspect: 'NAME',
};
const s3 = {
  itemId: 'scan.3',
  indexSK: '2020-01-03T01:02:10Z',
  fullName: 'Third Tester Bot',
  email: 'scan.3@operation.com',
  aspect: 'NAME',
};
const s4 = {
  itemId: 'scan.4',
  indexSK: '2020-01-04T01:02:11Z',
  fullName: 'Fourth Tester Bot',
  email: 'scan.4@operation.com',
  aspect: 'NAME',
};
const s5 = {
  itemId: 'scan.5',
  indexSK: '2020-01-05T01:02:12Z',
  fullName: 'Fifth Tester Bot',
  email: 'scan.5@operation.com',
  aspect: 'NAME',
};

describe('scan operation', () => {
  it('should filter NAME data of all users', async () => {
    const res = await scan({ table, skName: 'aspect', skValue: 'NAME' });
    res.sort(sortAlpha);
    expect(res).toEqual([s1, s2, s3, s4, s5]);
  });

  it('should filter NAM(E) data using "prefix"', async () => {
    const res = await scan({ table, skName: 'aspect', skValue: 'N', op: 'prefix' });
    res.sort(sortAlpha);
    expect(res).toEqual([s1, s2, s3, s4, s5]);
  });

  it('should scan the index and filter data using "between"', async () => {
    const res = await scan({
      table,
      index,
      skName: 'indexSK',
      skValue: '2020-01-02',
      skValue2: '2020-01-04',
      op: 'between',
    });
    // res.sort(sortAlpha);
    expect(res).toEqual([s2, s3]);
  });
});
