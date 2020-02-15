import AWS from 'aws-sdk';
import { query } from '../query';

AWS.config.update({
  region: 'us-east-1',
  dynamodb: {
    endpoint: 'http://localhost:8008',
  },
});

const table = 'TEST-AZDYN-USERS';
const index = 'USERS-INDEX';

const data1 = {
  itemId: 'get',
  aspect: 'ACCESS',
  indexSK: '2020-01-19T01:02:01Z',
  email: 'get@operation.com',
  fullName: 'Tester Bot',
  confirmed: true,
  confirmMessageCount: 3,
};

const data2 = {
  itemId: 'get',
  aspect: 'LOCATION',
  indexSK: '2020-01-19T01:02:02Z',
  description: 'A Very Nice Place',
  coordinates: { x: 1.1, y: 2.2, z: 3.3 },
};

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

describe('query operation', () => {
  it('should return all aspects', async () => {
    const res = await query({ table, pkName: 'itemId', pkValue: 'get' });
    expect(res).toEqual([data1, data2]);
  });

  it('should return only LOCATION aspect', async () => {
    const res = await query({
      table,
      pkName: 'itemId',
      pkValue: 'get',
      skName: 'aspect',
      skValue: 'LOCATION',
    });
    expect(res).toEqual([data2]);
  });

  it('should return empty list on inexistent keys', async () => {
    const r1 = await query({ table, pkName: 'itemId', pkValue: '__NADA__' });
    const r2 = await query({
      table,
      pkName: 'itemId',
      pkValue: '__NADA__',
      skName: 'aspect',
      skValue: 'ACCESS',
    });
    const r3 = await query({
      table,
      pkName: 'itemId',
      pkValue: 'get',
      skName: 'aspect',
      skValue: '__NADA__',
    });
    const r4 = await query({
      table,
      pkName: 'itemId',
      pkValue: 'get',
      skName: 'aspect',
      skValue: 'X',
      skValue2: 'Y',
      op: 'between',
    });
    expect(r1).toEqual([]);
    expect(r2).toEqual([]);
    expect(r3).toEqual([]);
    expect(r4).toEqual([]);
  });

  it('should query using "prefix"', async () => {
    const r1 = await query({
      table,
      pkName: 'itemId',
      pkValue: 'get',
      skName: 'aspect',
      skValue: 'A',
      op: 'prefix',
    });
    const r2 = await query({
      table,
      pkName: 'itemId',
      pkValue: 'get',
      skName: 'aspect',
      skValue: 'L',
      op: 'prefix',
    });
    expect(r1).toEqual([data1]);
    expect(r2).toEqual([data2]);
  });

  it('should query the index', async () => {
    const res = await query({ table, index, pkName: 'aspect', pkValue: 'NAME' });
    expect(res).toEqual([s1, s2, s3, s4, s5]);
  });

  it('should query the index using "prefix"', async () => {
    const res = await query({
      table,
      index,
      pkName: 'aspect',
      pkValue: 'NAME',
      skName: 'indexSK',
      skValue: '2020-01-01',
      op: 'prefix',
    });
    expect(res).toEqual([s1]);
  });

  it('should query the index using "between"', async () => {
    const res = await query({
      table,
      index,
      pkName: 'aspect',
      pkValue: 'NAME',
      skName: 'indexSK',
      skValue: '2020-01-01',
      skValue2: '2020-01-03T12:00:00Z',
      op: 'between',
    });
    expect(res).toEqual([s1, s2, s3]);
  });
});
