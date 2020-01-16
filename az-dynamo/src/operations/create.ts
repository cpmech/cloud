import { DynamoDB } from 'aws-sdk';
import { Iany } from '@cpmech/js2ts';
import { IPrimaryKey } from '../types';

// create creates data in DB
// NOTE: this function will call get first to check if the item exists already;
// So, this is NOT very efficient
export const create = async (table: string, primaryKey: IPrimaryKey, data: Iany) => {
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

  // put item (cannot use ReturnValues)
  await ddb
    .put({
      TableName: table,
      Item: {
        ...primaryKey,
        ...data,
      },
    })
    .promise();
};
