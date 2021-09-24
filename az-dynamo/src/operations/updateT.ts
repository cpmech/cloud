import { DynamoDB } from 'aws-sdk';
import { Iany } from '@cpmech/js2ts';
import { IPrimaryKey } from '../types';
import { any2updateData } from '../util/any2updateData';

export interface IUpdateTItem {
  table: string;
  primaryKey: IPrimaryKey;
  data: Iany;
  put?: boolean;
}

// updateT updates data in a single TRANSACTION
// (even from different tables in the same region)
// NOTE: (1) the max number of items to update is 10
//       (2) the updated values are returned by another call to the DB
//       (3) the primaryKey (partition or sort) MAY be present in 'data'
// ex: ConditionExpression: "attribute_not_exists(username)"
//
// The return data is retrieved using the transactGet method
// as in the getT of this library. In this case, the order is
// the SAME as the input.
//
//
export const updateT = async (
  items: IUpdateTItem[],
  returnItems = false,
): Promise<null | Iany[]> => {
  // check
  if (items.length < 1 || items.length > 10) {
    throw new Error('the number of items to update must be in [1, 10]');
  }

  // params
  const TransactItems = items.map(({ table, primaryKey, data, put }) =>
    put
      ? {
          Put: {
            TableName: table,
            Item: { ...primaryKey, ...data },
          },
        }
      : {
          Update: {
            TableName: table,
            Key: primaryKey,
            ...any2updateData(data, Object.keys(primaryKey)),
          },
        },
  );

  // transaction
  const ddb = new DynamoDB.DocumentClient();
  await ddb.transactWrite({ TransactItems }).promise();

  // get results
  if (returnItems) {
    const params = items.map(({ table, primaryKey }) => ({
      Get: {
        TableName: table,
        Key: primaryKey,
      },
    }));
    const res = await ddb.transactGet({ TransactItems: params }).promise();
    if (res.Responses) {
      return res.Responses.map((r) => r.Item || {});
    }
    return [];
  }

  // nothing to return
  return null;
};
