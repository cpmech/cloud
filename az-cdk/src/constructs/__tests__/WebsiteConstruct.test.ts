import { App, Stack, CfnOutput } from '@aws-cdk/core';
import { WebsiteConstruct } from '../WebsiteConstruct';
import { synthAppString } from '../../helpers/synthApp';

describe('WebsiteConstruct', () => {
  it('synthetizes properly', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new WebsiteConstruct(stack, 'Website', {
      domain: 'mydomain.com',
      comment: 'My nice website',
    });
    expect(synthAppString(app)).toMatchSnapshot();
  });

  it('synthetizes properly using certificateArn', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    const website = new WebsiteConstruct(stack, 'Website', {
      domain: 'mydomain.com',
      comment: 'My nice website',
      certificateArn: 'arn:aws:acm:REGION:ACCOUNT:certificate/12345-678-9012345',
    });
    new CfnOutput(stack, 'CloudFrontDistributionId', {
      value: website.cloudfrontDistributionId,
    });
    expect(synthAppString(app)).toMatchSnapshot();
  });
});

describe('WebsiteConstruct (prefixed)', () => {
  it('synthetizes properly using certificateArn', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new WebsiteConstruct(stack, 'Website', {
      domain: 'mydomain.com',
      prefix: 'app',
      comment: 'My app website',
      certificateArn: 'arn:aws:acm:REGION:ACCOUNT:certificate/12345-678-9012345',
    });
    expect(synthAppString(app)).toMatchSnapshot();
  });
});
