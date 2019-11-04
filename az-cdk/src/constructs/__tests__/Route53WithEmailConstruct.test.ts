import { App, Stack } from '@aws-cdk/core';
import { Route53RecvEmailConstruct } from '../Route53RecvEmailConstruct';
import { synthAppString } from '../../helpers/synthApp';

describe('Route53WithEmailConstruct', () => {
  it('synthetizes properly', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new Route53RecvEmailConstruct(stack, 'Route53WithEmailConstruct', {
      certificateArn: '<arn-goes-here>',
      comment: 'nada-nada',
      domain: 'mydomain.com',
      hostedZoneId: '<id-of-r53-zone>',
    });
    expect(synthAppString(app)).toMatchSnapshot();
  });
});
