import { DynamoDB } from 'aws-sdk';
import { Iany } from '@cpmech/js2ts';

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
export const scan = async (
  table: string,
  rangeKeyName: string,
  rangeKeyValue: string,
): Promise<Iany[]> => {
  const ddb = new DynamoDB.DocumentClient();
  const data = await ddb
    .scan({
      TableName: table,
      ExpressionAttributeNames: {
        [`#${rangeKeyName}`]: rangeKeyName,
      },
      ExpressionAttributeValues: {
        ':skey': rangeKeyValue,
      },
      FilterExpression: `#${rangeKeyName} = :skey`,
    })
    .promise();
  return data.Items ? data.Items : [];
};
