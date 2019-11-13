import { App, Stack } from '@aws-cdk/core';
import { CognitoConstruct } from '../CognitoConstruct';
import { synthAppString } from '../../helpers/synthApp';

describe('CognitoConstruct', () => {
  it('synthetizes properly', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new CognitoConstruct(stack, 'Cognito', {
      poolName: 'dear-users',
      emailSendingAccount: 'tester@sender.com',
    });
    expect(synthAppString(app)).toMatchSnapshot();
  });
});

describe('CognitoConstruct + Identity Providers', () => {
  it('synthetizes properly', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new CognitoConstruct(stack, 'Cognito', {
      poolName: 'dear-users',
      emailSendingAccount: 'tester@sender.com',
      facebookClientId: '123412341',
      facebookClientSecret: '12341asdas12341adf',
      googleClientId: '12341324.apps.googleusercontent.com',
      googleClientSecret: '123412341',
      domainPrefix: 'myapp-login',
      callbackUrls: ['https://localhost:3000/'],
      logoutUrls: ['https://localhost:3000/'],
    });
    expect(synthAppString(app)).toMatchSnapshot();
  });
});

describe('CognitoConstruct + Lambda Triggers', () => {
  it('synthetizes properly', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new CognitoConstruct(stack, 'Cognito', {
      poolName: 'dear-users',
      emailSendingAccount: 'tester@sender.com',
      postConfirmTrigger: true,
      postConfirmSendEmail: true,
      postConfirmDynamoTable: 'USERS',
      dirLayers: 'src/constructs/__tests__/lambda-layers',
    });
    expect(synthAppString(app)).toMatchSnapshot();
  });
});
