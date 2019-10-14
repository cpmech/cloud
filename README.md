# Libraries for Cloud Projects

This monorepo includes most of my libraries for developing `cloud` projects.

- `az-cdk` Constructs and stacks for the AmaZon-AWS CDK
- `az-cdk-crl` Custom Resource Lambdas (CRL) for CDK projects
- `az-cognito` AmaZon Cognito Tools
- `az-dynamo` AmaZon AWS DynamoDB Tools
- `az-lambda` AmaZon AWS Lambda tools
- `az-senqs` Simple {Email, Notification, Queue} Services
- `basic` Basic JS (TypeScript) functions
- `basic-sys` Basic JS (TypeScript) functions --- File System
- `httpcodes` HTTP Status Codes
- `js2ts` Converts Javascript objects to Typescript objects
- `lang-query-graph` Language Query Graph - GraphQL tools

### Deps

For a new package:

```bash
yarn add -D -W @types/jest @types/node jest prettier rollup rollup-plugin-node-resolve rollup-plugin-terser rollup-plugin-typescript2 ts-jest ts-node tslint tslint-config-prettier typescript
```
