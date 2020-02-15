import { DynamoDB } from 'aws-sdk';
import { Iany } from '@cpmech/js2ts';

export interface IQueryInput {
  table: string;
  index?: string; // index name => will search the index instead
  pkName: string; // hashKeyName
  pkValue: string; // hashKeyValue
  skName?: string; // rangeKeyName
  skValue?: string; // rangeKeyValue
  skValue2?: string; // rangeKeyValue => to be used with the 'between' op
  op?: '<=' | '<' | '=' | '>' | '>=' | 'prefix' | 'between'; // default is '='
}

// query returns one or more items from the DB
// NOTE: the hashKey is essential and the rangeKey is optional
export const query = async ({
  table,
  index,
  pkName: pkName,
  pkValue: pkValue,
  skName: skName,
  skValue: skValue,
  skValue2: skValue2,
  op,
}: IQueryInput): Promise<Iany[]> => {
  // set default op
  if (!op) {
    op = '=';
  }

  // params
  const params: DynamoDB.DocumentClient.QueryInput = {
    TableName: table,
    IndexName: index,
  };

  // with primary and sort keys and a second value for the sort condition (BETWEEN)
  if (skName && skValue2) {
    params.ExpressionAttributeNames = {
      [`#${pkName}`]: pkName,
      [`#${skName}`]: skName,
    };
    params.ExpressionAttributeValues = {
      ':hval': pkValue,
      ':rval': skValue,
      ':rval2': skValue2,
    };
    params.KeyConditionExpression = `#${pkName} = :hval and #${skName} BETWEEN :rval AND :rval2`;
  }

  // with hash (primary) and range (sort) keys
  else if (skName) {
    params.ExpressionAttributeNames = {
      [`#${pkName}`]: pkName,
      [`#${skName}`]: skName,
    };
    params.ExpressionAttributeValues = {
      ':hval': pkValue,
      ':rval': skValue,
    };
    params.KeyConditionExpression =
      op === 'prefix'
        ? `#${pkName} = :hval and begins_with(#${skName}, :rval)`
        : `#${pkName} = :hval and #${skName} ${op} :rval`;
  }

  // just hash key (primary key)
  else {
    params.ExpressionAttributeNames = { [`#${pkName}`]: pkName };
    params.ExpressionAttributeValues = { ':hval': pkValue };
    params.KeyConditionExpression = `#${pkName} = :hval`;
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
