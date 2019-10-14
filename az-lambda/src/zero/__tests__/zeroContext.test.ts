import { zeroContext } from '../zeroContext';

describe('zeroContext', () => {
  test('type definition works', () => {
    expect(zeroContext.getRemainingTimeInMillis()).toBe(0);
    expect(zeroContext.done()).toBe(undefined);
    expect(zeroContext.fail('')).toBe(undefined);
    expect(zeroContext.succeed({})).toBe(undefined);
  });
});
