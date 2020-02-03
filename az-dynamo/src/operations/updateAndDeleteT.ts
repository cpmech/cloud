import { DynamoDB } from 'aws-sdk';
import { Iany } from '@cpmech/js2ts';
import { IPrimaryKey } from '../types';
import { any2updateData } from '../util/any2updateData';

// updateAndDeleteT updates some data and delete other in a single TRANSACTION
// (even from different tables in the same region)
// NOTE: (1) the total number of items (update, delete) must be less than 10
//       (2) the updated values are returned by another call to the DB
// ex: ConditionExpression: "attribute_not_exists(username)"
export const updateAndDeleteT = async (
  itemsUpdate: {
    table: string;
    primaryKey: IPrimaryKey;
    data: Iany;
    ConditionExpression?: string;
  }[],
  itemsDelete: {
    table: string;
    primaryKey: IPrimaryKey;
    ConditionExpression?: string;
  }[],
) => {
  // check
  const sum = itemsUpdate.length + itemsDelete.length;
  if (sum < 1 || sum > 10) {
    throw new Error('the total number of items must be in [1, 10]');
  }

  // params: update
  const pUpdate = itemsUpdate.map(({ table, primaryKey, data, ConditionExpression }) => ({
    Update: {
      TableName: table,
      Key: primaryKey,
      ...any2updateData(data),
      ConditionExpression,
    },
  }));

  // params: delete
  const pDelete = itemsDelete.map(({ table, primaryKey, ConditionExpression }) => ({
    Delete: {
      TableName: table,
      Key: primaryKey,
      ConditionExpression,
    },
  }));

  // transaction
  const ddb = new DynamoDB.DocumentClient();
  const params = (pUpdate as any[]).concat(pDelete);
  await ddb.transactWrite({ TransactItems: params }).promise();
};
