import { DynamoDB } from 'aws-sdk';
import { Iany } from '@cpmech/js2ts';
import { IPrimaryKey } from '../types';
import { any2updateData } from '../util/any2updateData';

// updateT updates data in DB in a single transaction and returns the new values
// NOTE: (1) up to 10 items can be updated at the same time
//       (2) if returnItems === true, another call to the DB is made using transactGet
export const updateT = async (
  items: { table: string; primaryKey: IPrimaryKey; data: Iany }[],
  returnItems = true,
): Promise<null | Iany[]> => {
  // check
  if (items.length < 1 || items.length > 10) {
    throw new Error('the number of items to update must in [1, 10]');
  }

  // update data
  const TransactItems = items.map(({ table, primaryKey, data }) => ({
    Update: {
      TableName: table,
      Key: primaryKey,
      ...any2updateData(data),
    },
  }));

  // client
  const ddb = new DynamoDB.DocumentClient();

  // update all
  await ddb.transactWrite({ TransactItems }).promise();

  // response data
  if (returnItems) {
    const TransactItemsRes = items.map(({ table, primaryKey, data }) => ({
      Get: {
        TableName: table,
        Key: primaryKey,
      },
    }));
    const res = await ddb.transactGet({ TransactItems: TransactItemsRes }).promise();
    if (res.Responses) {
      return res.Responses.map(r => r.Item || {});
    }
    return [];
  }

  // results
  return null;
};
