import { App, Stack } from '@aws-cdk/core';
import { LambdaApiConstruct, ICustomApiDomainName } from '../LambdaApiConstruct';
import { synthAppString } from '../../helpers/synthApp';

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

  it('synthetizes using dirDist', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new LambdaApiConstruct(stack, 'LambdaApi', {
      gatewayName: 'TestApi',
      dirDist: 'dist',
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
      cognitoId: 'us-east-1_abcdefgh',
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
      cognitoId: 'us-east-1_abcdefgh',
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
      dirLayers: 'src/constructs/__tests__/lambda-layers',
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
      cognitoId: 'us-east-1_abcdefgh',
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
