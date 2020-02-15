import { DynamoDB } from 'aws-sdk';
import { Iany } from '@cpmech/basic';
import { IPrimaryKey } from '../types';

export interface IGetTItem {
  table: string;
  primaryKey: IPrimaryKey;
}

// getT gets data in a single TRANSACTION
// (even from different tables in the same region)
//
// From the AWS: It returns an ordered array of up to 25 ItemResponse objects,
// each of which corresponds to the TransactGetItem object in the same position
// in the TransactItems array
//
//     i.e. It returns in the SAME ORDER as the input
//
// Reference: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#transactGetItems-property
//
export const getT = async (items: IGetTItem[]): Promise<Iany[]> => {
  // params
  const TransactItems = items.map(({ table, primaryKey }) => ({
    Get: {
      TableName: table,
      Key: primaryKey,
    },
  }));

  // transaction
  const ddb = new DynamoDB.DocumentClient();
  const res = await ddb.transactGet({ TransactItems }).promise();
  if (res.Responses) {
    return res.Responses.map(r => r.Item || {});
  }
  return [];
};
