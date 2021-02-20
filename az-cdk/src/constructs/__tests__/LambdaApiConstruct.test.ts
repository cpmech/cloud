import { App, Stack } from '@aws-cdk/core';
import { LambdaApiConstruct, ICustomApiDomainName } from '../LambdaApiConstruct';
import { synthAppString } from '../../helpers/synthApp';
import { Runtime } from '@aws-cdk/aws-lambda';

describe('LambdaApiConstruct', () => {
  it('synthetizes properly', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new LambdaApiConstruct(stack, 'LambdaApi', {
      gatewayName: 'TestApi',
      lambdas: [
        {
          filenameKey: 'index',
          handlerName: 'handler',
          httpMethods: ['GET'],
          route: 'hello',
          subroute: '{id}',
          unprotected: true,
        },
      ],
    });
    expect(synthAppString(app)).toMatchSnapshot();
  });

  it('synthetizes using dirDist and python', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new LambdaApiConstruct(stack, 'LambdaApi', {
      gatewayName: 'TestApi',
      lambdas: [
        {
          filenameKey: 'lambda',
          handlerName: 'handler',
          httpMethods: ['GET'],
          route: 'hello',
          unprotected: true,
          dirDist: 'python',
          runtime: Runtime.PYTHON_3_7,
        },
      ],
    });
    expect(synthAppString(app)).toMatchSnapshot();
  });

  it('synthetizes without subroute', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new LambdaApiConstruct(stack, 'LambdaApi', {
      gatewayName: 'TestApi',
      lambdas: [
        {
          filenameKey: 'index',
          handlerName: 'handler',
          httpMethods: ['GET'],
          route: 'hello',
          unprotected: true,
        },
      ],
    });
    expect(synthAppString(app)).toMatchSnapshot();
  });
});

describe('LambdaApiConstruct (protected)', () => {
  it('synthetizes properly', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new LambdaApiConstruct(stack, 'LambdaApi', {
      gatewayName: 'TestApi',
      cognitoPoolId: 'us-east-1_abcdefgh',
      lambdas: [
        {
          filenameKey: 'index',
          handlerName: 'handler',
          httpMethods: ['GET'],
          route: 'hello',
          subroute: '{id}',
        },
      ],
    });
    expect(synthAppString(app)).toMatchSnapshot();
  });
});

describe('LambdaApiConstruct (layers)', () => {
  it('synthetizes properly', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new LambdaApiConstruct(stack, 'LambdaApi', {
      gatewayName: 'TestApi',
      cognitoPoolId: 'us-east-1_abcdefgh',
      lambdas: [
        {
          filenameKey: 'index',
          handlerName: 'handler',
          httpMethods: ['GET'],
          route: 'hello',
          subroute: '{id}',
        },
      ],
      useLayers: true,
    });
    expect(synthAppString(app)).toMatchSnapshot();
  });
});

describe('LambdaApiConstruct (customDomain)', () => {
  it('synthetizes properly', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    const customDomain: ICustomApiDomainName = {
      prefixedDomain: 'api1-dev.mydomain.com',
      certificateArn: '<arn-of-certificate>',
      r53HostedZoneId: '<hosted-zone-id>',
    };
    new LambdaApiConstruct(stack, 'LambdaApi', {
      gatewayName: 'TestApi',
      cognitoPoolId: 'us-east-1_abcdefgh',
      lambdas: [
        {
          filenameKey: 'index',
          handlerName: 'handler',
          httpMethods: ['GET'],
          route: 'hello',
          subroute: '{id}',
        },
      ],
      customDomain,
    });
    expect(synthAppString(app)).toMatchSnapshot();
  });
});

describe('LambdaApiConstruct (dynamo and bucket)', () => {
  it('synthetizes properly', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new LambdaApiConstruct(stack, 'LambdaApi', {
      gatewayName: 'TestApi',
      lambdas: [
        {
          filenameKey: 'index',
          handlerName: 'handler',
          httpMethods: ['GET'],
          route: 'hello',
          subroute: '{id}',
          unprotected: true,
          accessDynamoTables: ['TABLE'],
          accessBuckets: ['BUCKET'],
        },
      ],
    });
    expect(synthAppString(app)).toMatchSnapshot();
  });
});
