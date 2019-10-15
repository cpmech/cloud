import fs from 'fs';
import { updateEnvars } from '../updateEnvars';

const TMP_ENVARS_JSON = '/tmp/__test__envars-cli.update.json';

const tmpEnvarsJson = `{
  "myapp": {
    "dev": {
      "APP_NAME": "my application 😄",
      "UNCHANGED": "Hello World"
    }
  }
}`;

describe('updateEnvars', () => {
  it('updates existent key and adds a new key [stage = dev]', () => {
    fs.writeFileSync(TMP_ENVARS_JSON, tmpEnvarsJson);
    const envars = {
      APP_NAME: 'my new app v2.0',
      NEW_ITEM: 'new item',
    };
    updateEnvars(envars, TMP_ENVARS_JSON, 'myapp');
    const output = fs.readFileSync(TMP_ENVARS_JSON, { encoding: 'UTF-8' });
    const data = JSON.parse(output);
    expect(data).toEqual({
      myapp: {
        dev: {
          APP_NAME: 'my new app v2.0',
          NEW_ITEM: 'new item',
          UNCHANGED: 'Hello World',
        },
      },
    });
  });

  it('adds a new project to an existent file', () => {
    fs.writeFileSync(TMP_ENVARS_JSON, tmpEnvarsJson);
    const envars = {
      MESSAGE: `let's do it`,
    };
    updateEnvars(envars, TMP_ENVARS_JSON, 'crazyProject');
    const output = fs.readFileSync(TMP_ENVARS_JSON, { encoding: 'UTF-8' });
    const data = JSON.parse(output);
    expect(data).toEqual({
      myapp: {
        dev: {
          APP_NAME: 'my application 😄',
          UNCHANGED: 'Hello World',
        },
      },
      crazyProject: {
        dev: {
          MESSAGE: `let's do it`,
        },
      },
    });
  });

  it('adds a new stage to existent project', () => {
    fs.writeFileSync(TMP_ENVARS_JSON, tmpEnvarsJson);
    const envars = {
      APP_NAME: 'ready for production',
    };
    updateEnvars(envars, TMP_ENVARS_JSON, 'myapp', 'prod');
    const output = fs.readFileSync(TMP_ENVARS_JSON, { encoding: 'UTF-8' });
    const data = JSON.parse(output);
    expect(data).toEqual({
      myapp: {
        dev: {
          APP_NAME: 'my application 😄',
          UNCHANGED: 'Hello World',
        },
        prod: {
          APP_NAME: 'ready for production',
        },
      },
    });
  });

  it('creates a new file with new data', () => {
    try {
      fs.unlinkSync(TMP_ENVARS_JSON);
    } catch (_) {
      /* OK */
    }
    const envars = {
      NEW_DATA: `Hello Again`,
    };
    updateEnvars(envars, TMP_ENVARS_JSON, 'newProject');
    const output = fs.readFileSync(TMP_ENVARS_JSON, { encoding: 'UTF-8' });
    const data = JSON.parse(output);
    expect(data).toEqual({
      newProject: {
        dev: {
          NEW_DATA: `Hello Again`,
        },
      },
    });
  });

  it('delete keys', () => {
    fs.writeFileSync(TMP_ENVARS_JSON, tmpEnvarsJson);
    updateEnvars({}, TMP_ENVARS_JSON, 'myapp', 'dev', ['APP_NAME']);
    const output = fs.readFileSync(TMP_ENVARS_JSON, { encoding: 'UTF-8' });
    const data = JSON.parse(output);
    expect(data).toEqual({
      myapp: {
        dev: {
          UNCHANGED: 'Hello World',
        },
      },
    });
  });
});
