import { getProp, hasSameProp } from '../helpers';

describe('helpers', () => {
  test('getProp works', () => {
    const obj = {
      alpha: 'alpha',
      beta: 123,
    };

    expect(getProp(obj, 'alpha')).toBe('alpha');
    expect(getProp(obj, 'beta')).toBe(123);
  });

  test('hasSameProp (basic) works', () => {
    const reference = {
      alpha: '',
      beta: 0,
    };

    const target1 = {
      alpha: 'alpha',
      beta: 123,
    };

    const target2 = {
      alpha: 123,
      beta: 'beta',
    };

    expect(hasSameProp(reference, target1, 'alpha')).toBe(true);
    expect(hasSameProp(reference, target1, 'beta')).toBe(true);
    expect(hasSameProp(reference, target2, 'alpha')).toBe(false);
    expect(hasSameProp(reference, target2, 'beta')).toBe(false);
  });

  test('hasSameProp (deep) works', () => {
    const reference = {
      deep: { p: { q: 0 } },
    };

    const target1 = {
      deep: { p: { q: 'different type here => ok' } },
    };

    const target2 = {
      deep: {},
    };

    const target3 = {};

    const target4 = {
      deep: 'hello',
    };

    expect(hasSameProp(reference, target1, 'deep')).toBe(true); // OK: deep is an 'object'
    expect(hasSameProp(reference, target2, 'deep')).toBe(true); // OK: deep is an 'object'
    expect(hasSameProp(reference, target3, 'deep')).toBe(false);
    expect(hasSameProp(reference, target4, 'deep')).toBe(false);
  });
});
