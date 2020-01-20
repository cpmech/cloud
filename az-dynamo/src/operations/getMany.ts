import { DynamoDB } from 'aws-sdk';
import { Iany } from '@cpmech/js2ts';
import { hasProp } from '@cpmech/basic';

// getMany gets many items from the DB
// NOTE: this function will return null if there are no items
export const getMany = async (
  table: string,
  keys: Iany[], // must be less than 100 items
  filterAttributes?: string, // comma-separated list of attributes to return; otherwise will return all
): Promise<Iany[]> => {
  // dynamodb
  const ddb = new DynamoDB.DocumentClient();

  // request
  const res = await ddb
    .batchGet({
      RequestItems: {
        [table]: {
          Keys: keys,
          ProjectionExpression: filterAttributes,
        },
      },
    })
    .promise();

  // check for unprocessed keys
  if (res.UnprocessedKeys && hasProp(res.UnprocessedKeys, table)) {
    throw new Error('getMany: cannot handle unprocessed keys at this time');
  }

  // extract results
  if (res.Responses && hasProp(res.Responses, table)) {
    return res.Responses[table];
  }

  // there is nothing
  return [];
};
