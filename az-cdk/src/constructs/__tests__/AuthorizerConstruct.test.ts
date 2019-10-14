import { App, Stack } from '@aws-cdk/core';
import { AuthorizerConstruct } from '../AuthorizerConstruct';
import { synthAppString } from '../../helpers/synthApp';

describe('AuthorizerConstruct', () => {
  it('synthetizes properly', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new AuthorizerConstruct(stack, 'Authorizer', {
      cognitoUserPoolId: 'users',
      restApiId: 'rest-api-id',
    });
    expect(synthAppString(app)).toMatchSnapshot();
  });
});
