import AWS from 'aws-sdk';
import { getT } from '../getT';

AWS.config.update({
  region: 'us-east-1',
  dynamodb: {
    endpoint: 'http://localhost:8008',
  },
});

const tableName = 'TEST-AZDYN-USERS';

describe('getT operation', () => {
  it('should get two items at the same time', async () => {
    const key1 = { itemId: 'getT', aspect: 'TOGET' };
    const key2 = { itemId: 'getT', aspect: 'TOGET_TOO' };
    const res = await getT([
      { table: tableName, primaryKey: key1 },
      { table: tableName, primaryKey: key2 },
    ]);
    const correct = [
      {
        ...key1,
        indexSK: 'hello',
        message: 'world',
      },
      {
        ...key2,
        indexSK: 'alô',
        value: 'mundo',
      },
    ];
    expect(res).toEqual(correct);
  });
});
