import fs from 'fs';
import { writeDatabase } from '../writeDatabase';

const TMP_ENVARS_JSON = '/tmp/__test__envars-cli.write.json';

const refEnvarsJson = {
  myapp: {
    dev: {
      APP_NAME: 'my application 😄 [writing]',
    },
  },
};

describe('writeDatabase', () => {
  beforeEach(() => {
    try {
      fs.unlinkSync(TMP_ENVARS_JSON);
    } catch (_) {
      /* OK */
    }
  });

  it('works', () => {
    writeDatabase(TMP_ENVARS_JSON, refEnvarsJson);
    const db = fs.readFileSync(TMP_ENVARS_JSON, { encoding: 'UTF-8' });
    const data = JSON.parse(db);
    expect(data).toEqual(refEnvarsJson);
  });
});
