import { DynamoDB } from 'aws-sdk';
import { Iany } from '@cpmech/js2ts';
import { IPrimaryKey } from '../types';

// get gets a single item from DB
// NOTE: this function will return null if the item does not exist
export const get = async (table: string, primaryKey: IPrimaryKey): Promise<Iany | null> => {
  const ddb = new DynamoDB.DocumentClient();
  const data = await ddb
    .get({
      TableName: table,
      Key: primaryKey,
    })
    .promise();
  if (data.Item) {
    return data.Item;
  }
  return null;
};
