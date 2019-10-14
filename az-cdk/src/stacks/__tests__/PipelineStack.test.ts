import { App, SecretValue } from '@aws-cdk/core';
import { ssmSecret } from '../../helpers/ssmSecret';
import { synthAppString } from '../../helpers/synthApp';
import { PipelineStack } from '../PipelineStack';

describe('PipelineStack', () => {
  it('synthetizes using ssmSecret', () => {
    const app = new App();
    new PipelineStack(app, 'Pipeline', {
      githubRepo: 'myrepo',
      githubUser: 'cpmech',
      githubSecret: ssmSecret({ name: 'gh-token-path', version: '1' }),
      services: ['apigateway', 'lambda'],
      envars: { APP_NAME: 'myapp', VERSION: '1.0' },
      useYarn: true,
    });
    expect(synthAppString(app)).toMatchSnapshot();
  });

  it('synthetizes using secretsManager', () => {
    const app = new App();
    new PipelineStack(app, 'Pipeline', {
      githubRepo: 'myrepo',
      githubUser: 'cpmech',
      githubSecret: SecretValue.secretsManager('gh-token-path'),
      services: ['apigateway', 'lambda'],
      useYarn: true,
    });
    expect(synthAppString(app)).toMatchSnapshot();
  });

  it('synthetizes using ssmSecret and NPM', () => {
    const app = new App();
    new PipelineStack(app, 'Pipeline', {
      githubRepo: 'myrepo',
      githubUser: 'cpmech',
      githubSecret: ssmSecret({ name: 'gh-token-path', version: '1' }),
      services: ['apigateway', 'lambda'],
      envars: { APP_NAME: 'myapp', VERSION: '1.0' },
    });
    expect(synthAppString(app)).toMatchSnapshot();
  });
});

describe('PipelineStack (with notifications)', () => {
  it('synthetizes properly', () => {
    const app = new App();
    new PipelineStack(app, 'Pipeline', {
      githubRepo: 'myrepo',
      githubUser: 'cpmech',
      githubSecret: ssmSecret({ name: 'gh-token-path', version: '1' }),
      services: ['apigateway', 'lambda'],
      notificationEmails: ['listener@monitor.com', 'admin@mydomain.com'],
    });
    expect(synthAppString(app)).toMatchSnapshot();
  });
});
