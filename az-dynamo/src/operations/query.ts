import { DynamoDB } from 'aws-sdk';
import { Iany } from '@cpmech/js2ts';

// query returns one or more items from the DB
// NOTE: the hashKey is essential and the rangeKey is optional
export const query = async (
  table: string,
  hashKeyName: string,
  hashKeyValue: string,
  rangeKeyName?: string,
  rangeKeyValue?: string,
  rangeKeyOp: '<' | '=' | '>' = '=',
): Promise<Iany[]> => {
  const ddb = new DynamoDB.DocumentClient();
  const data = await ddb
    .query({
      TableName: table,
      KeyConditionExpression: rangeKeyName
        ? `${hashKeyName} = :hkey and ${rangeKeyName} ${rangeKeyOp} :rkey`
        : `${hashKeyName} = :hkey`,
      ExpressionAttributeValues: rangeKeyName
        ? { ':hkey': hashKeyValue, ':rkey': rangeKeyValue }
        : { ':hkey': hashKeyValue },
    })
    .promise();
  return data.Items ? data.Items : [];
};
