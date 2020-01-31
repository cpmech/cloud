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
  // params
  const params: DynamoDB.DocumentClient.QueryInput = {
    TableName: table,
    IndexName: index,
  };

  // with hash and sort keys and a second value for the sort condition (BETWEEN)
  if (rangeKeyName && rangeKeyValue2) {
    params.ExpressionAttributeNames = {
      [`#${hashKeyName}`]: hashKeyName,
      [`#${rangeKeyName}`]: rangeKeyName,
    };
    params.ExpressionAttributeValues = {
      ':hval': hashKeyValue,
      ':rval': rangeKeyValue,
      ':rval2': rangeKeyValue2,
    };
    params.KeyConditionExpression = `#${hashKeyName} = :hval and #${rangeKeyName} BETWEEN :rval AND :rval2`;
  }

  // with hash and sort keys
  else if (rangeKeyName) {
    params.ExpressionAttributeNames = {
      [`#${hashKeyName}`]: hashKeyName,
      [`#${rangeKeyName}`]: rangeKeyName,
    };
    params.ExpressionAttributeValues = {
      ':hval': hashKeyValue,
      ':rval': rangeKeyValue,
    };
    params.KeyConditionExpression =
      op === 'prefix'
        ? `#${hashKeyName} = :hval and begins_with(#${rangeKeyName}, :rval)`
        : `#${hashKeyName} = :hval and #${rangeKeyName} ${op} :rval`;
  }

  // just hash key
  else {
    params.ExpressionAttributeNames = { [`#${hashKeyName}`]: hashKeyName };
    params.ExpressionAttributeValues = { ':hval': hashKeyValue };
    params.KeyConditionExpression = `#${hashKeyName} = :hval`;
  }

  // perform query
  const ddb = new DynamoDB.DocumentClient();
  const data = await ddb.query(params).promise();

  // check
  if (data.LastEvaluatedKey) {
    throw new Error('cannot handle partial results just yet');
  }

  // results
  return data.Items ? data.Items : [];
};
