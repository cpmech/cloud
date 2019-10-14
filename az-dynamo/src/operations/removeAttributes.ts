import { DynamoDB } from 'aws-sdk';
import { IPrimaryKey } from '../types';

// removeAttributes deletes attributes in item (keeps item)
export const removeAttributes = async (
  table: string,
  primaryKey: IPrimaryKey,
  attributeNames: string[],
) => {
  const ddb = new DynamoDB.DocumentClient();
  const atts = attributeNames.join(', ');
  await ddb
    .update({
      TableName: table,
      Key: primaryKey,
      UpdateExpression: `REMOVE ${atts}`,
    })
    .promise();
};
