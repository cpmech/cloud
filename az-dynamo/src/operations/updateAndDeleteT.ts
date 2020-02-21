import { DynamoDB } from 'aws-sdk';
import { IPrimaryKey } from '../types';
import { any2updateData } from '../util/any2updateData';
import { IUpdateTItem } from './updateT';

export interface IDeleteTItem {
  table: string;
  primaryKey: IPrimaryKey;
}

// updateAndDeleteT updates some data and delete other in a single TRANSACTION
// (even from different tables in the same region)
// NOTE: (1) the total number of items (update, delete) must be less than 10
//       (2) the updated values are returned by another call to the DB
//       (3) the primaryKey (partition or sort) MAY be present in 'data'
// ex: ConditionExpression: "attribute_not_exists(username)"
export const updateAndDeleteT = async (
  itemsUpdate: IUpdateTItem[],
  itemsDelete: IDeleteTItem[],
) => {
  // check
  const sum = itemsUpdate.length + itemsDelete.length;
  if (sum < 1 || sum > 10) {
    throw new Error('the total number of items must be in [1, 10]');
  }

  // params: update
  const pUpdate = itemsUpdate.map(({ table, primaryKey, data }) => ({
    Update: {
      TableName: table,
      Key: primaryKey,
      ...any2updateData(data, Object.keys(primaryKey)),
    },
  }));

  // params: delete
  const pDelete = itemsDelete.map(({ table, primaryKey }) => ({
    Delete: {
      TableName: table,
      Key: primaryKey,
    },
  }));

  // transaction
  const ddb = new DynamoDB.DocumentClient();
  const params = (pUpdate as any[]).concat(pDelete);
  await ddb.transactWrite({ TransactItems: params }).promise();
};
