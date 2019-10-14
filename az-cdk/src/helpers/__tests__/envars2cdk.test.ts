import { envars2cdk } from '../envars2cdk';

describe('envars2cdk', () => {
  it('converts envars to CDK data format', () => {
    const envars = {
      APP_NAME: 'my application 😄',
      MESSAGE: 'Hello CDK!',
    };
    const res = envars2cdk(envars);
    expect(res).toEqual({
      APP_NAME: { value: 'my application 😄' },
      MESSAGE: { value: 'Hello CDK!' },
    });
  });
});
