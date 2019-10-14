import { App, Stack } from '@aws-cdk/core';
import { Route53ForSendingEmailConstruct } from '../Route53ForSendingEmailConstruct';
import { synthAppString } from '../../helpers/synthApp';

describe(' Route53ForSendingEmailConstruct', () => {
  it('synthetizes properly', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new Route53ForSendingEmailConstruct(stack, 'ReceiveEmailSQSConstruct', {
      certificateArn: '<arn-goes-here>',
      comment: 'nada-nada',
      domain: 'mydomain.com',
      hostedZoneId: '<id-of-r53-zone>',
    });
    expect(synthAppString(app)).toMatchSnapshot();
  });
});
