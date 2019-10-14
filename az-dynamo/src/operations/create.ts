import { DynamoDB } from 'aws-sdk';
import { Iany } from '@cpmech/js2ts';
import { IPrimaryKey } from '../types';

// create creates data in DB and returns the new values
// NOTE: this function will call get twice;
// first it will call get to check if the item already exists; then
// it will call get again to return the update values
// So, this is NOT EFFICIENT
export const create = async (table: string, primaryKey: IPrimaryKey, data: Iany): Promise<Iany> => {
  const ddb = new DynamoDB.DocumentClient();

  // check if item exists already
  const exists = await ddb
    .get({
      TableName: table,
      Key: primaryKey,
      AttributesToGet: Object.keys(primaryKey),
    })
    .promise();
  if (exists.Item) {
    throw new Error(`item with key = ${JSON.stringify(primaryKey)} exists already`);
  }

  // put item
  await ddb
    .put({
      TableName: table,
      Item: {
        ...primaryKey,
        ...data,
      },
    })
    .promise();

  // return item
  const createdData = await ddb
    .get({
      TableName: table,
      Key: primaryKey,
    })
    .promise();
  if (createdData.Item) {
    return createdData.Item;
  }
  throw new Error('DynamoDB create failed with no results');
};
