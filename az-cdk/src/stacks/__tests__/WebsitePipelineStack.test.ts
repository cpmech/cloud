import { App } from '@aws-cdk/core';
import { ssmSecret } from '../../helpers/ssmSecret';
import { WebsitePipelineStack } from '../WebsitePipelineStack';
import { synthAppString } from '../../helpers/synthApp';

describe('WebsitePipelineStack', () => {
  it('synthetizes properly', () => {
    const app = new App();
    new WebsitePipelineStack(app, 'WebsitePipeline', {
      githubRepo: 'myrepo',
      githubUser: 'cpmech',
      githubSecret: ssmSecret({ name: 'gh-token-path', version: '1' }),
      websiteBucketName: 'mydomain.com-website',
      cloudfrontDistributionId: '1234567-0001234123',
      envars: { APP_NAME: 'myapp', VERSION: '1.0' },
      useYarn: true,
    });
    expect(synthAppString(app)).toMatchSnapshot();
  });
});

describe('WebsitePipelineStack (with notifications)', () => {
  it('synthetizes properly', () => {
    const app = new App();
    new WebsitePipelineStack(app, 'WebsitePipeline', {
      githubRepo: 'myrepo',
      githubUser: 'cpmech',
      githubSecret: ssmSecret({ name: 'gh-token-path', version: '1' }),
      websiteBucketName: 'mydomain.com-website',
      cloudfrontDistributionId: '1234567-0001234123',
      notificationEmails: ['listener@monitor.com', 'admin@mydomain.com'],
    });
    expect(synthAppString(app)).toMatchSnapshot();
  });
});
