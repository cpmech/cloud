import fsextra from 'fs-extra';
import { maybeWriteFile } from '../index';

const PATH = '/tmp/basic.test.datafile.1.txt';

beforeAll(() => {
  fsextra.removeSync(PATH);
});

describe('maybeWriteFile', () => {
  test('write works', () => {
    maybeWriteFile(false, PATH, () => {
      return 'Hello World';
    });
    const res = fsextra.readFileSync(PATH);
    expect(String(res)).toBe('Hello World');
  });

  test('overwrite works', () => {
    maybeWriteFile(true, PATH, () => {
      return 'Hello World';
    });
    const r1 = fsextra.readFileSync(PATH);
    expect(String(r1)).toBe('Hello World');

    maybeWriteFile(true, PATH, () => {
      return 'Overwritten';
    });
    const r2 = fsextra.readFileSync(PATH);
    expect(String(r2)).toBe('Overwritten');
  });

  test('overwrite fails', () => {
    const doWrite = () =>
      maybeWriteFile(false, PATH, () => {
        return 'Hello World';
      });
    expect(() => doWrite()).toThrow(`file <${PATH}> exists`);
  });
});
