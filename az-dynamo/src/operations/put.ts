import { DynamoDB } from 'aws-sdk';
import { Iany } from '@cpmech/js2ts';
import { IPrimaryKey } from '../types';

// put puts data in DB and returns the new values
// NOTE: (1) this function will return null if data is empty like {}
//       (2) the primaryKey (partition or sort) MAY be present in 'data'
//       (3) the partitiona/sort values in data will override the values in primaryKey;
//           thus they should NOT be different that the ones in primaryKey
export const put = async (table: string, primaryKey: IPrimaryKey, data?: Iany) => {
  const input = { ...primaryKey, ...data };
  if (Object.keys(input).length === 0) {
    return null;
  }
  const ddb = new DynamoDB.DocumentClient();
  await ddb
    .put({
      TableName: table,
      Item: input,
      ReturnValues: 'ALL_OLD',
    })
    .promise();
};
