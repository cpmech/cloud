import { App, Stack } from '@aws-cdk/core';
import { LambdaConstruct } from '../LambdaConstruct';
import { synthAppString } from '../../helpers/synthApp';

describe('LambdaConstruct', () => {
  it('synthetizes properly', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new LambdaConstruct(stack, 'Lambda', {
      filenameKey: 'index',
      handlerName: 'handler',
    });
    expect(synthAppString(app)).toMatchSnapshot();
  });
});
