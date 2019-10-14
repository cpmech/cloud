import { DynamoDB } from 'aws-sdk';
import { IPrimaryKey } from '../types';
import { key2ddbKey } from '../util/key2ddbKey';

// increment increments attribute by 1 (or incVal)
export const increment = async (
  table: string,
  primaryKey: IPrimaryKey,
  attributeName: string,
  incVal: number = 1,
) => {
  const ddb = new DynamoDB();
  await ddb
    .updateItem({
      TableName: table,
      Key: key2ddbKey(primaryKey),
      UpdateExpression: `ADD ${attributeName} :incval`,
      ExpressionAttributeValues: { ':incval': { N: `${incVal}` } },
    })
    .promise();
};
