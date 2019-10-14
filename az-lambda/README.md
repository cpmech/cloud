# AmaZon AWS Lambda tools

Tools for implementing AWS Lambda functions.

## Installation

```bash
yarn add @cpmech/az-lambda
```

## Example

### With query parameters and with json body

#### Code

```ts
import {
  IEvent,
  IResult,
  response,
  zeroEvent,
  zeroContext,
  makeHandlerWithQueryParams,
  makeHandlerWithJsonBody,
} from '@cpmech/az-lambda';

interface IParams {
  a: string;
  b: string;
}

const reference: IParams = {
  a: '',
  b: '',
};

const func = async (params: IParams): Promise<IResult> =>
  response.ok({ message: `hello world ${params.a} ${params.b}` });

const handler1 = makeHandlerWithQueryParams(reference, func);

const handler2 = makeHandlerWithJsonBody(reference, func);

const event1: IEvent = {
  ...zeroEvent,
  queryStringParameters: { a: 'A', b: 'B' },
};

const event2: IEvent = {
  ...zeroEvent,
  body: JSON.stringify({ a: 'AAA', b: 'BBB' }),
};

handler1(event1, zeroContext).then(res => {
  console.log(res);
});

handler2(event2, zeroContext).then(res => {
  console.log(res);
});
```

#### Output

```
{
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  },
  body: '{"message":"hello world A B"}'
}
{
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  },
  body: '{"message":"hello world AAA BBB"}'
}
```
