import { Construct } from '@aws-cdk/core';
import {
  Table,
  AttributeType,
  BillingMode,
  GlobalSecondaryIndexProps,
  LocalSecondaryIndexProps,
} from '@aws-cdk/aws-dynamodb';

export interface IDynamoTable {
  name: string; // name of table
  partitionKey: string; // name of partiton key (the value will be string)
  partitionKeyType?: AttributeType; // [default = STRING]
  sortKey?: string; // name of sort key (the value will be string)
  sortKeyType?: AttributeType; // [default = STRING]
  onDemand?: boolean; // if false, will not touch default provisioned values
  ttlAttribute?: string; // name of TTL attribute
  pitRecovery?: boolean; // point in time recovery
  readCapacity?: number; // read capacity for the table
  writeCapacity?: number; // write capacity for the table
  gsis?: GlobalSecondaryIndexProps[];
  lsis?: LocalSecondaryIndexProps[];
}

export interface IDynamoApiProps {
  dynamoTables: IDynamoTable[]; // create some DynamoDB tables
}

export class DynamoConstruct extends Construct {
  readonly name2table: { [tableName: string]: Table } = {};

  constructor(scope: Construct, id: string, props: IDynamoApiProps) {
    super(scope, id);

    props.dynamoTables.forEach((t, i) => {
      // new table
      const table = new Table(this, `Table${i}`, {
        tableName: t.name,
        partitionKey: {
          name: t.partitionKey,
          type: t.partitionKeyType ? t.partitionKeyType : AttributeType.STRING,
        },
        sortKey: t.sortKey
          ? {
              name: t.sortKey,
              type: t.sortKeyType ? t.sortKeyType : AttributeType.STRING,
            }
          : undefined,
        billingMode: t.onDemand ? BillingMode.PAY_PER_REQUEST : undefined,
        timeToLiveAttribute: t.ttlAttribute ? t.ttlAttribute : undefined,
        pointInTimeRecovery: t.pitRecovery ? t.pitRecovery : undefined,
        readCapacity: t.readCapacity ? t.readCapacity : undefined,
        writeCapacity: t.writeCapacity ? t.writeCapacity : undefined,
      });

      // indices
      if (t.gsis) {
        t.gsis.forEach(gsi => table.addGlobalSecondaryIndex(gsi));
      }
      if (t.lsis) {
        t.lsis.forEach(lsi => table.addLocalSecondaryIndex(lsi));
      }

      // save
      this.name2table[t.name] = table;
    });
  }
}
