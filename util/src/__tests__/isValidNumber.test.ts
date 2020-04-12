import { isValidNumber } from '../isValidNumber';

describe('isValidNumber', () => {
  it('should catch wrong values', () => {
    expect(isValidNumber('aaa')).toBeFalsy();
    expect(isValidNumber('')).toBeFalsy();
    expect(isValidNumber(0 / 0)).toBeFalsy();
    expect(isValidNumber(-0 / 0)).toBeFalsy();
    expect(isValidNumber(1 / 0)).toBeFalsy();
    expect(isValidNumber(-1 / 0)).toBeFalsy();
  });
  it('should handle correct values', () => {
    expect(isValidNumber(-666)).toBeTruthy();
    expect(isValidNumber('-1')).toBeTruthy();
    expect(isValidNumber(-1)).toBeTruthy();
    expect(isValidNumber('0')).toBeTruthy();
    expect(isValidNumber('0.00')).toBeTruthy();
    expect(isValidNumber(0)).toBeTruthy();
    expect(isValidNumber(0.0)).toBeTruthy();
    expect(isValidNumber(1)).toBeTruthy();
    expect(isValidNumber(1.0)).toBeTruthy();
    expect(isValidNumber(1000000000000)).toBeTruthy();
  });
});
