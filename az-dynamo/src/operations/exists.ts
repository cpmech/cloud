import { DynamoDB } from 'aws-sdk';
import { IPrimaryKey } from '../types';

// exists checks if item exists in table or not
export const exists = async (table: string, primaryKey: IPrimaryKey): Promise<boolean> => {
  const ddb = new DynamoDB.DocumentClient();
  const data = await ddb
    .get({
      TableName: table,
      Key: primaryKey,
      AttributesToGet: Object.keys(primaryKey),
    })
    .promise();
  return !!data.Item;
};
