import { logErr } from '../logErr';

const errMessages: string[] = [];

const lastErr = (i: number = 0) => {
  if (errMessages.length > i) {
    return errMessages[errMessages.length - 1 - i];
  } else {
    return '';
  }
};

jest.spyOn(global.console, 'log').mockImplementation((msg: any) => errMessages.push(msg));

describe('logErr', () => {
  test('handles null', () => {
    logErr(null);
    expect(lastErr()).toBe('[ERROR] object is null');
  });

  test('handles missing key', () => {
    const obj = { a: 'a' };
    logErr(obj, 'b');
    expect(lastErr(1)).toBe(`[ERROR] object = ${JSON.stringify(obj)}`);
    expect(lastErr()).toBe(`[ERROR] property for key = b doesn't exist or has incorrect type`);
  });
});
