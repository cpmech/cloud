# Language Query Graph - GraphQL tools

lang-query-graph (LQG <-> GQL) implements code for helping with GraphQL.

## Installation

```bash
yarn add @cpmech/lang-query-graph
```

## Example

```ts
import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { matchGQL } from '@cpmech/lang-query-graph';

interface MyType {
  name: string;
  email: string;
  address: string;
}

const myType: MyType = {
  name: 'my name',
  email: 'my@email.com',
  address: 'testing place where we test things',
};

const ast: DocumentNode = gql`
  type MyType {
    name: String!
    email: String!
    address: String!
  }

  fragment MyTypeFrag on MyType {
    name
    email
    address
  }
`;

// should not throw an error:
matchGQL(myType, ast, 'MyType', 'MyTypeFrag');
```
