import AWS from 'aws-sdk';
import { exponentialBackoff } from '@cpmech/util';

export const tableExists = async (table: string): Promise<boolean> => {
  const ddb = new AWS.DynamoDB();
  const params: AWS.DynamoDB.DescribeTableInput = { TableName: table };
  try {
    const res = await ddb.describeTable(params).promise();
    if (res.Table) {
      return res.Table.TableName === table;
    }
  } catch (_) {}
  return false;
};

export const tableIsActive = async (table: string): Promise<boolean> => {
  const ddb = new AWS.DynamoDB();
  const params: AWS.DynamoDB.DescribeTableInput = { TableName: table };
  try {
    const res = await ddb.describeTable(params).promise();
    if (res.Table) {
      return res.Table.TableStatus === 'ACTIVE';
    }
  } catch (_) {}
  return false;
};

export const tableDelete = async (table: string) => {
  const ddb = new AWS.DynamoDB();
  const params: AWS.DynamoDB.DeleteTableInput = { TableName: table };
  try {
    await ddb.deleteTable(params).promise();
  } catch (_) {}
};

export const tableDeleteAndWait = async (table: string) => {
  await tableDelete(table);
  await exponentialBackoff(async () => {
    const hasTable = await tableExists(table);
    return !hasTable;
  });
};

export const tableWaitActive = async (table: string) => {
  await exponentialBackoff(async () => {
    return await tableIsActive(table);
  });
};
