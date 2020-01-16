import { Construct } from '@aws-cdk/core';
import { Table, AttributeType, BillingMode } from '@aws-cdk/aws-dynamodb';

export interface IDynamoTable {
  name: string; // name of table
  partitionKey: string; // name of partiton key (the value will be string)
  sortKey?: string; // name of sort key (the value will be string)
  onDemand?: boolean; // if false, will not touch default provisioned values
}

export interface IDynamoApiProps {
  dynamoTables: IDynamoTable[]; // create some DynamoDB tables
}

export class DynamoConstruct extends Construct {
  readonly name2table: { [tableName: string]: Table } = {};

  constructor(scope: Construct, id: string, props: IDynamoApiProps) {
    super(scope, id);

    props.dynamoTables.forEach((t, i) => {
      const table = new Table(this, `Table${i}`, {
        tableName: t.name,
        partitionKey: { name: t.partitionKey, type: AttributeType.STRING },
        sortKey: t.sortKey ? { name: t.sortKey, type: AttributeType.STRING } : undefined,
        billingMode: t.onDemand ? BillingMode.PAY_PER_REQUEST : undefined,
      });
      this.name2table[t.name] = table;
    });
  }
}
