import { DynamoDB } from 'aws-sdk';
import { Iany } from '@cpmech/js2ts';
import { IPrimaryKey } from '../types';
import { any2updateData } from '../util/any2updateData';

// update updates data in DB and returns the new values
// NOTE: this function will return null if data is empty like {}
export const update = async (
  table: string,
  primaryKey: IPrimaryKey,
  data: Iany,
): Promise<Iany | null> => {
  if (Object.keys(data).length === 0) {
    return null;
  }
  const ddb = new DynamoDB.DocumentClient();
  const upData = any2updateData(data);
  const updatedData = await ddb
    .update({
      TableName: table,
      Key: primaryKey,
      ReturnValues: 'ALL_NEW',
      ...upData,
    })
    .promise();
  if (updatedData.Attributes) {
    return updatedData.Attributes;
  }
  return null;
};
