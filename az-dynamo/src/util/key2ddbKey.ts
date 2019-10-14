import { DynamoDB } from 'aws-sdk';
import { IPrimaryKey } from '../types';

// key2ddbKey converts (primary) Ikey to (raw) DynamoDB.Key
export const key2ddbKey = (keyObject: IPrimaryKey): DynamoDB.Key => {
  return Object.keys(keyObject).reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: { S: keyObject[curr] },
    }),
    {},
  );
};
