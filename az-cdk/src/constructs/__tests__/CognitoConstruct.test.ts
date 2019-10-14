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
