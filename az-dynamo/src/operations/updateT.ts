import { DynamoDB } from 'aws-sdk';
import { Iany } from '@cpmech/js2ts';
import { IPrimaryKey } from '../types';
import { any2updateData } from '../util/any2updateData';

// updateT updates data in a single TRANSACTION
// (even from different tables in the same region)
// NOTE: (1) the max number of items to update is 10
//       (2) the updated values are returned by another call to the DB
// ex: ConditionExpression: "attribute_not_exists(username)"
export const updateT = async (
  items: {
    table: string;
    primaryKey: IPrimaryKey;
    data: Iany;
    ConditionExpression?: string;
  }[],
  returnItems = false,
): Promise<null | Iany[]> => {
  // check
  if (items.length < 1 || items.length > 10) {
    throw new Error('the number of items to update must be in [1, 10]');
  }

  // params
  const TransactItems = items.map(({ table, primaryKey, data, ConditionExpression }) => ({
    Update: {
      TableName: table,
      Key: primaryKey,
      ...any2updateData(data),
      ConditionExpression,
    },
  }));

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
      return res.Responses.map(r => r.Item || {});
    }
    return [];
  }

  // nothing to return
  return null;
};
