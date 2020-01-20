import AWS from 'aws-sdk';
import { tableExists, tableIsActive, tableDeleteAndWait, tableWaitActive } from '../table';

AWS.config.update({
  region: 'us-east-1',
  dynamodb: {
    endpoint: 'http://localhost:8008',
  },
});

const tableName = 'TEST-AZDYN-USERS';

describe('tables', () => {
  it('tableExists should return true', async () => {
    const res = await tableExists(tableName);
    expect(res).toBeTruthy();
  });

  it('tableIsActive should return true', async () => {
    const res = await tableIsActive(tableName);
    expect(res).toBeTruthy();
  });

  it('tableWaitActive and tableDeleteAndWait should work', async () => {
    const ddb = new AWS.DynamoDB();
    const name = '__TEMPORARY__';
    const params: AWS.DynamoDB.CreateTableInput = {
      TableName: name,
      AttributeDefinitions: [{ AttributeName: 'itemId', AttributeType: 'S' }],
      KeySchema: [{ AttributeName: 'itemId', KeyType: 'HASH' }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    };
    await ddb.createTable(params).promise();
    await tableWaitActive(name);
    const r1 = await tableExists(name);
    expect(r1).toBeTruthy();
    await tableDeleteAndWait(name);
    const r2 = await tableExists(name);
    expect(r2).toBeFalsy();
  });
});
