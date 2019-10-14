import { DynamoDB } from 'aws-sdk';
import { IPrimaryKey } from '../types';

// removeItem deletes the whole item, including attributes
export const removeItem = async (table: string, primaryKey: IPrimaryKey) => {
  const ddb = new DynamoDB.DocumentClient();
  await ddb
    .delete({
      TableName: table,
      Key: primaryKey,
    })
    .promise();
};
