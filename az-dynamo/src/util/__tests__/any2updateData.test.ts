import { Iany } from '@cpmech/js2ts';
import { any2updateData } from '../any2updateData';

const correctUpdateExpression = 'SET #y0 = :x0, #y1 = :x1, #y2 = :x2, #y3 = :x3';
const correctExpressionAttributeNames = {
  '#y0': 'alpha',
  '#y1': 'beta',
  '#y2': 'gamma',
  '#y3': 'delta',
};
const correctExpressionAttributeValues = {
  ':x0': 'alpha',
  ':x1': 123,
  ':x2': true,
  ':x3': { a: 'a', b: 456, c: false, d: { tooDeep: 'yes' } },
};

const noUndefCorrectUpdateExpression = 'SET #y0 = :x0, #y1 = :x1, #y2 = :x2';
const noUndefCorrectExpressionAttributeNames = {
  '#y0': 'alpha',
  '#y1': 'beta',
  '#y2': 'gamma',
};
const noUndefCorrectExpressionAttributeValues = {
  ':x0': 'alpha',
  ':x1': 123,
  ':x2': true,
};

describe('any2updateData', () => {
  it('converts data properly with primaryKeyNames', () => {
    const obj: Iany = {
      itemId: '0000-xxxx-00000',
      aspect: 'DATA',
      alpha: 'alpha',
      beta: 123,
      gamma: true,
      delta: { a: 'a', b: 456, c: false, d: { tooDeep: 'yes' } },
    };
    const res = any2updateData(obj, ['itemId', 'aspect']);
    expect(res.UpdateExpression).toBe(correctUpdateExpression);
    expect(res.ExpressionAttributeNames).toEqual(correctExpressionAttributeNames);
    expect(res.ExpressionAttributeValues).toEqual(correctExpressionAttributeValues);
  });

  it('converts data properly without primaryKeyNames in object', () => {
    const obj: Iany = {
      alpha: 'alpha',
      beta: 123,
      gamma: true,
      delta: { a: 'a', b: 456, c: false, d: { tooDeep: 'yes' } },
    };
    const res = any2updateData(obj, ['itemId', 'aspect']);
    expect(res.UpdateExpression).toBe(correctUpdateExpression);
    expect(res.ExpressionAttributeNames).toEqual(correctExpressionAttributeNames);
    expect(res.ExpressionAttributeValues).toEqual(correctExpressionAttributeValues);
  });

  it('converts data properly without primaryKeyNames given', () => {
    const obj: Iany = {
      alpha: 'alpha',
      beta: 123,
      gamma: true,
      delta: { a: 'a', b: 456, c: false, d: { tooDeep: 'yes' } },
    };
    const res = any2updateData(obj, []);
    expect(res.UpdateExpression).toBe(correctUpdateExpression);
    expect(res.ExpressionAttributeNames).toEqual(correctExpressionAttributeNames);
    expect(res.ExpressionAttributeValues).toEqual(correctExpressionAttributeValues);
  });

  it('should remove undefined entries', () => {
    const obj: Iany = {
      alpha: 'alpha',
      beta: 123,
      gamma: true,
      delta: undefined,
      quadrant: undefined,
    };
    const res = any2updateData(obj, []);
    expect(res.UpdateExpression).toBe(noUndefCorrectUpdateExpression);
    expect(res.ExpressionAttributeNames).toEqual(noUndefCorrectExpressionAttributeNames);
    expect(res.ExpressionAttributeValues).toEqual(noUndefCorrectExpressionAttributeValues);
  });
});
