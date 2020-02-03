import { DynamoDB } from 'aws-sdk';
import { Iany } from '@cpmech/basic';
import { IPrimaryKey } from '../types';

// getT gets data in a single TRANSACTION
// (even from different tables in the same region)
export const getT = async (
  items: { table: string; primaryKey: IPrimaryKey }[],
): Promise<Iany[]> => {
  // params
  const TransactItems = items.map(({ table, primaryKey }) => ({
    Get: {
      TableName: table,
      Key: primaryKey,
    },
  }));

  // transaction
  const ddb = new DynamoDB.DocumentClient();
  const res = await ddb.transactGet({ TransactItems }).promise();
  if (res.Responses) {
    return res.Responses.map(r => r.Item || {});
  }
  return [];
};
