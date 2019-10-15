import fs from 'fs';
import { loadDatabase } from '../loadDatabase';

const TMP_ENVARS_JSON = '/tmp/__test__envars-cli.json';

const tmpEnvarsJson = `{
  "myapp": {
    "dev": {
      "APP_NAME": "my application 😄",
      "EMPTY_VAR": ""
    }
  }
}`;

const refEnvarsJson = {
  myapp: {
    dev: {
      APP_NAME: 'my application 😄',
      EMPTY_VAR: '',
    },
  },
};

describe('loadDatabase', () => {
  beforeEach(() => {
    fs.writeFileSync(TMP_ENVARS_JSON, tmpEnvarsJson);
  });

  it('loads file properly', () => {
    const db = loadDatabase(TMP_ENVARS_JSON);
    expect(db).toEqual(refEnvarsJson);
  });

  test('fails because of inexistent path', () => {
    expect(() => {
      loadDatabase('');
    }).toThrowError('ENOENT: no such file or directory, open');
  });
});
