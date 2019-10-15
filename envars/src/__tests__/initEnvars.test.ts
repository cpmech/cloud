import { initEnvars } from '../initEnvars';

beforeAll(() => {
  process.env.APP_NAME = 'my application 😄';
  process.env.EMPTY_VAR = '';
});

describe('initEnvars', () => {
  it('reads NODE_ENV and APP_NAME', () => {
    const envars = {
      NODE_ENV: '',
      APP_NAME: '',
    };
    initEnvars(envars);
    expect(envars).toEqual({
      NODE_ENV: 'test',
      APP_NAME: 'my application 😄',
    });
  });

  it('throws error due to MISSING_VARIABLE', () => {
    const envars = {
      MISSING_VARIABLE: '',
    };
    expect(() => initEnvars(envars)).toThrow(
      'cannot find environment variable named "MISSING_VARIABLE"',
    );
  });

  it('throws error due to EMPTY_VAR', () => {
    const envars = {
      EMPTY_VAR: '',
    };
    expect(() => initEnvars(envars)).toThrow('environment variable "EMPTY_VAR" must not be empty');
  });
});
