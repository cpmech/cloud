import { numOnly } from '../index';

describe('numOnly', () => {
  test('works', () => {
    const res = numOnly('a-1-b-2-c-3');
    expect(res).toBe('123');
  });
});
