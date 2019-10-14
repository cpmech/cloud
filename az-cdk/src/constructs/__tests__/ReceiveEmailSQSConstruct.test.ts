import { App, Stack } from '@aws-cdk/core';
import { ReceiveEmailSQSConstruct } from '../ReceiveEmailSQSConstruct';
import { synthAppString } from '../../helpers/synthApp';

describe('ReceiveEmailSQSConstruct', () => {
  it('synthetizes properly', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new ReceiveEmailSQSConstruct(stack, 'ReceiveEmailSQS', {
      emails: ['admin@here.com', 'tester@here.com'],
    });
    expect(synthAppString(app)).toMatchSnapshot();
  });
});
