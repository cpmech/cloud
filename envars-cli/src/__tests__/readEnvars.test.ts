import fs, { read } from 'fs';
import { readEnvars } from '../readEnvars';

const TMP_ENVARS_JSON = '/tmp/__test__envars-cli.json';

const tmpEnvarsJson = `{
  "myapp": {
    "dev": {
      "APP_NAME": "my application 😄",
      "EMPTY_VAR": ""
    },
    "prod": {
      "APP_NAME": "my application 😄 [production]",
      "EMPTY_VAR": "<must-not-be-empty>"
    }
  }
}
`;

describe('readEnvars', () => {
  beforeEach(() => {
    fs.writeFileSync(TMP_ENVARS_JSON, tmpEnvarsJson);
  });

  it('works with default stage = dev', () => {
    const envars = readEnvars(TMP_ENVARS_JSON, 'myapp');
    expect(envars).toEqual({
      APP_NAME: 'my application 😄',
      EMPTY_VAR: '',
    });
  });

  it('works with stage = prod', () => {
    const envars = readEnvars(TMP_ENVARS_JSON, 'myapp', 'prod');
    expect(envars).toEqual({
      APP_NAME: 'my application 😄 [production]',
      EMPTY_VAR: '<must-not-be-empty>',
    });
  });

  it('fails because stage is not available', () => {
    expect(() => {
      readEnvars(TMP_ENVARS_JSON, 'myapp', 'testing');
    }).toThrowError(
      `${TMP_ENVARS_JSON} does not have variables for stage = "testing" of project = "myapp"`,
    );
  });

  it('it fails because project does not exist', () => {
    expect(() => {
      readEnvars(TMP_ENVARS_JSON, 'INEXISTENT_PROJECT');
    }).toThrowError(`${TMP_ENVARS_JSON} does not have project = "INEXISTENT_PROJECT"`);
  });

  it('it fails because file does not exist', () => {
    expect(() => {
      readEnvars('__INEXISTENT_FILE___', 'myapp');
    }).toThrowError(`ENOENT: no such file or directory, open '__INEXISTENT_FILE___'`);
  });
});
