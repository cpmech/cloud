# AmaZon AWS DynamoDB Tools

Tools for implementing DynamoDB.

## Installation

```bash
yarn add @cpmech/az-dynamo
```

## Example

```ts
import AWS from 'aws-sdk';
import { create, get, update, increment, removeAttributes, removeItem } from '@cpmech/az-dynamo';

AWS.config.update({
  region: 'us-east-1',
  dynamodb: {
    endpoint: 'http://localhost:8000',
  },
});

const table = 'TEST_USERS';

const key = { email: 'tester@domain.com' };
const data = { hello: 'world', hits: 0 };

await create(table, key, data);
const res1 = await get(table, key);
console.log(res1);

await update(table, key, { hello: 'mundo' });
const res2 = await get(table, key);
console.log(res2);

await increment(table, key, 'hits');
const res3 = await get(table, key);
console.log(res3);

await removeAttributes(table, key, ['hits']);
const res4 = await get(table, key);
console.log(res4);

await removeItem(table, key);
```
