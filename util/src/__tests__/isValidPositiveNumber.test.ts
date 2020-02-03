import { isValidPositiveNumber } from '../isValidPositiveNumber';

describe('isValidPositiveNumber', () => {
  it('should catch wrong values', () => {
    expect(isValidPositiveNumber('aaa')).toBeFalsy();
    expect(isValidPositiveNumber('')).toBeFalsy();
    expect(isValidPositiveNumber('-1')).toBeFalsy();
    expect(isValidPositiveNumber('0')).toBeFalsy();
    expect(isValidPositiveNumber('0.00')).toBeFalsy();
    expect(isValidPositiveNumber(0)).toBeFalsy();
    expect(isValidPositiveNumber(0.0)).toBeFalsy();
    expect(isValidPositiveNumber(-1)).toBeFalsy();
    expect(isValidPositiveNumber(-666)).toBeFalsy();
    expect(isValidPositiveNumber(0 / 0)).toBeFalsy();
    expect(isValidPositiveNumber(-0 / 0)).toBeFalsy();
    expect(isValidPositiveNumber(1 / 0)).toBeFalsy();
    expect(isValidPositiveNumber(-1 / 0)).toBeFalsy();
  });
  it('should handle correct values', () => {
    expect(isValidPositiveNumber(1)).toBeTruthy();
    expect(isValidPositiveNumber(1.0)).toBeTruthy();
    expect(isValidPositiveNumber(1000000000000)).toBeTruthy();
  });
});
