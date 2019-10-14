import { hasProp } from '../index';

describe('hasProp', () => {
  test('does have property', () => {
    const obj = { data: 'hello world' };
    expect(hasProp(obj, 'data')).toBe(true);
  });

  test('does not have property', () => {
    const obj = { data: 'hello world' };
    expect(hasProp(obj, 'time')).toBe(false);
  });
});
