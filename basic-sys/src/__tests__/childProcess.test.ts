import { onExit, runCmd } from '../index';
import cp from 'child_process';

const COMMAND_NOT_FOUND_CODE = '127';

describe('childProcess', () => {
  test('onExit works', async () => {
    const sp = cp.spawn('echo', ['Hello World']);
    sp.stdout.on('data', data => {
      expect(String(data)).toBe('Hello World\n');
    });
    await onExit(sp);
  });

  test('onExit captures exit with error code', async () => {
    const sp = cp.spawn('bash', ['/tmp/__inexistent_file__.bash']);
    await expect(onExit(sp)).rejects.toThrow(`Exit with error code = ${COMMAND_NOT_FOUND_CODE}`);
  });

  test('onExit captures error', async () => {
    const sp = cp.fork(`${__dirname}/xdummy.js`);
    await onExit(sp);
    sp.send({ message: 'get this' });
    await expect(onExit(sp)).rejects.toThrow();
  });

  test('runCmd works', async () => {
    const res = await runCmd('echo', ['Hello Commander']);
    expect(String(res)).toBe('Hello Commander\n');
  });

  test('runCmd returns stderr', async () => {
    console.warn = jest.fn();
    await expect(runCmd('sed', ['s'])).rejects.toThrow();
    expect(console.warn).toBeCalled();
  });

  test('runCmd hides stderr', async () => {
    console.warn = jest.fn();
    await expect(runCmd('sed', ['s'], false)).rejects.toThrow();
    expect(console.warn).not.toBeCalled();
  });
});
