# Constructs and stacks for the AmaZon-AWS CDK

az-cdk implements some constructs for use with the fantastic AWS CDK tool.

## Installation

```bash
npm install @cpmech/az-cdk
```

## Examples

[See more working examples here](https://github.com/cpmech/az-cdk-examples)

### Website

Creates Route53, S3, and Cloudfront resources, in addition of taking care of all permissions.

NOTE: The hostedZoneId and certificateArn are optional - in this case, a new Route53 zone is created.

```ts
import { App, Stack } from '@aws-cdk/core';
import { WebsiteConstruct } from '@cpmech/az-cdk';

const app = new App();

const stack = new Stack(app, 'WebsiteStack');

new WebsiteConstruct(stack, 'Website', {
  domain: 'mydomain.com',
  comment: 'My Awesome Website',
  hostedZoneId: '<hosted-zone-id>',
  certificateArn: '<arn-of-certificate>',
});
```

### Cognito

Creates a Cognito user pool, in addition of taking care of all permissions.

```ts
import { App, Stack } from '@aws-cdk/core';
import { CognitoConstruct } from '@cpmech/az-cdk';

const app = new App();

const stack = new Stack(app, 'CognitoStack');

new CognitoConstruct(stack, 'Cognito', {
  emailSendingAccount: 'info@mydomain.com',
  poolName: 'my-users',
});
```

### Receive Emails (SES, SNS, and SQS)

Creates S{E,N,Q}S resources to receive emails, in addition of taking care of all permissions.

```ts
import { App, Stack } from '@aws-cdk/core';
import { ReceiveEmailSQSConstruct } from '@cpmech/az-cdk';

const app = new App();

const stack = new Stack(app, 'EmailsStack');

new ReceiveEmailSQSConstruct(stack, 'EmailSQS', {
  emails: ['admin@mydomain.com', 'tester@mydomain.com'],
});
```

### Lambda and API Gateway (service)

Creates lambda functions and the API Gateway, in addition of taking care of all permissions.

NOTE: customDomain is optional.

```ts
import { App, Stack } from '@aws-cdk/core';
import { LambdaApiConstruct, LambdaLayersConstruct } from '@cpmech/az-cdk';

const app = new App();

const stack = new Stack(app, 'ServiceStack');

new LambdaApiConstruct(stack, 'API', {
  gatewayName: 'API',
  cognitoId: '<cognito-user-pool-id>',
  lambdas: [
    {
      filenameKey: 'index',
      handlerName: 'handler',
      httpMethods: ['GET', 'POST'],
      route: 'helloworld',
    },
  ],
  layers: new LambdaLayersConstruct(stack, 'Layers'),
  customDomain: {
    prefixedDomain: 'api.mydomain.com',
    certificateArn: '<arn-of-certificate>',
    r53HostedZoneId: '<hosted-zone-id>',
  },
  dirDist: 'dist',
});
```

### Pipeline for Website

Creates a CodePipeline to update a website.

```ts
import { App } from '@aws-cdk/core';
import { WebsitePipelineStack, ssmSecret } from '@cpmech/az-cdk';

const app = new App();

new WebsitePipelineStack(app, 'WebsitePipelineStack', {
  githubRepo: '<github-repo>',
  githubUser: '<github-user>',
  githubSecret: ssmSecret('<ssm-param-github>'),
  websiteBucketName: 'mydomain.com-website',
  cloudfrontDistributionId: '<cloudfront-id>',
  assetsDir: 'public',
  notificationEmails: ['my@email.com'],
});
```

### Pipeline for Lambda (service)

Creates a CodePipeline to update a service stack.

```ts
import { App, Stack } from '@aws-cdk/core';
import { PipelineStack, ssmSecret } from '@cpmech/az-cdk';

const app = new App();

new PipelineStack(app, 'PipelineStack', {
  githubRepo: '<github-repo>',
  githubUser: '<github-user>',
  githubSecret: ssmSecret('<ssm-param-github>'),
  services: ['apigateway', 'lambda'],
  notificationEmails: ['my@email.com'],
});
```
