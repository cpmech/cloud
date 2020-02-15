import { DynamoDB } from 'aws-sdk';
import { Iany } from '@cpmech/js2ts';

export interface IScanInput {
  table: string;
  index?: string; // index name => will scan the index instead
  skName: string; // rangeKeyName
  skValue: string; // rangeKeyValue
  skValue2?: string; // rangeKeyValue => to be used with the 'between' op
  op?: '<=' | '<' | '=' | '>' | '>=' | 'prefix' | 'between'; // default is '='
}

// scan returns all items from the table
// NOTE: the hashKey is not needed here, but the rangeKey is essential
//
// NOTE from the AWS:
//
//   In general, Scan operations are less efficient than other operations in DynamoDB.
//   A Scan operation always scans the entire table or secondary index.
//   It then filters out values to provide the result you want,
//   essentially adding the extra step of removing data from the result set.
//
//   If possible, you should avoid using a Scan operation on a large table or index
//   with a filter that removes many results.
//
//   Also, as a table or index grows, the Scan operation slows.
//   The Scan operation examines every item for the requested values and
//   can use up the provisioned throughput for a large table or index in a single operation.
//
//   For faster response times, design your tables and indexes so that your
//   applications can use Query instead of Scan.
//   (For tables, you can also consider using the GetItem and BatchGetItem APIs.)
//
export const scan = async ({
  table,
  index,
  skName,
  skValue,
  skValue2,
  op,
}: IScanInput): Promise<Iany[]> => {
  // set default op
  if (!op) {
    op = '=';
  }

  // params
  const params: DynamoDB.DocumentClient.ScanInput = {
    TableName: table,
    IndexName: index,
  };

  // 'between' case
  if (skValue2) {
    params.ExpressionAttributeNames = {
      [`#${skName}`]: skName,
    };
    params.ExpressionAttributeValues = {
      ':rval': skValue,
      ':rval2': skValue2,
    };
    params.FilterExpression = `#${skName} BETWEEN :rval AND :rval2`;
  }

  // default
  else {
    params.ExpressionAttributeNames = {
      [`#${skName}`]: skName,
    };
    params.ExpressionAttributeValues = {
      ':rval': skValue,
    };
    params.FilterExpression =
      op === 'prefix' ? `begins_with(#${skName}, :rval)` : `#${skName} ${op} :rval`;
  }

  // perform scan
  const ddb = new DynamoDB.DocumentClient();
  const data = await ddb.scan(params).promise();

  // check
  if (data.LastEvaluatedKey) {
    throw new Error('cannot handle partial results just yet');
  }

  // results
  return data.Items ? data.Items : [];
};
