import { Iany } from '@cpmech/js2ts';
import { any2updateData } from '../any2updateData';

describe('any2updateData', () => {
  it('converts data properly', () => {
    const obj: Iany = {
      alpha: 'alpha',
      beta: 123,
      gamma: true,
      delta: { a: 'a', b: 456, c: false, d: { tooDeep: 'yes' } },
    };
    const res = any2updateData(obj);
    expect(res.UpdateExpression).toBe('SET #y0 = :x0, #y1 = :x1, #y2 = :x2, #y3 = :x3');
    expect(res.ExpressionAttributeNames).toEqual({
      '#y0': 'alpha',
      '#y1': 'beta',
      '#y2': 'gamma',
      '#y3': 'delta',
    });
    expect(res.ExpressionAttributeValues).toEqual({
      ':x0': 'alpha',
      ':x1': 123,
      ':x2': true,
      ':x3': { a: 'a', b: 456, c: false, d: { tooDeep: 'yes' } },
    });
  });
});
