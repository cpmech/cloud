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
  index?: string, // index name
  op: '<=' | '<' | '=' | '>' | '>=' | 'prefix' | 'between' = '=',
  rangeKeyValue2?: string, // to be used with the 'between' op
): Promise<Iany[]> => {
  // ddb object
  const ddb = new DynamoDB.DocumentClient();

  // with hash and sort keys and a second value for the sort condition
  if (rangeKeyName && rangeKeyValue2) {
    const data = await ddb
      .query({
        TableName: table,
        IndexName: index,
        ExpressionAttributeNames: {
          [`#${hashKeyName}`]: hashKeyName,
          [`#${rangeKeyName}`]: rangeKeyName,
        },
        ExpressionAttributeValues: {
          ':hval': hashKeyValue,
          ':rval': rangeKeyValue,
          ':rval2': rangeKeyValue2,
        },
        KeyConditionExpression: `#${hashKeyName} = :hval and #${rangeKeyName} BETWEEN :rval AND :rval2`,
      })
      .promise();
    return data.Items ? data.Items : [];
  }

  // with hash and sort keys
  if (rangeKeyName) {
    const data = await ddb
      .query({
        TableName: table,
        IndexName: index,
        ExpressionAttributeNames: {
          [`#${hashKeyName}`]: hashKeyName,
          [`#${rangeKeyName}`]: rangeKeyName,
        },
        ExpressionAttributeValues: {
          ':hval': hashKeyValue,
          ':rval': rangeKeyValue,
        },
        KeyConditionExpression:
          op === 'prefix'
            ? `#${hashKeyName} = :hval and begins_with(#${rangeKeyName}, :rval)`
            : `#${hashKeyName} = :hval and #${rangeKeyName} ${op} :rval`,
      })
      .promise();
    return data.Items ? data.Items : [];
  }

  // just hash key
  const data = await ddb
    .query({
      TableName: table,
      IndexName: index,
      ExpressionAttributeNames: { [`#${hashKeyName}`]: hashKeyName },
      ExpressionAttributeValues: { ':hval': hashKeyValue },
      KeyConditionExpression: `#${hashKeyName} = :hval`,
    })
    .promise();
  return data.Items ? data.Items : [];
};
