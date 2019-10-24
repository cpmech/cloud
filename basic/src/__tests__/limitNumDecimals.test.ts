import { limitNumDecimals } from '../limitNumDecimals';

describe('limitNumDecimals', () => {
  it('should not change values without decimals', () => {
    expect(limitNumDecimals(123)).toBe(123);
    expect(limitNumDecimals('123')).toBe(123);
  });

  it('should not change values with few decimal digits', () => {
    expect(limitNumDecimals(123.4)).toBe(123.4);
    expect(limitNumDecimals(123.45)).toBe(123.45);
    expect(limitNumDecimals('123.4')).toBe(123.4);
    expect(limitNumDecimals('123.45')).toBe(123.45);
  });

  it('should remove excess decimal digits', () => {
    expect(limitNumDecimals(123.451)).toBe(123.45);
    expect(limitNumDecimals(123.45123)).toBe(123.45);
    expect(limitNumDecimals('123.451')).toBe(123.45);
    expect(limitNumDecimals('123.45123')).toBe(123.45);
    expect(limitNumDecimals(123.456)).toBe(123.46);
    expect(limitNumDecimals(123.45678)).toBe(123.46);
    expect(limitNumDecimals('123.456')).toBe(123.46);
    expect(limitNumDecimals('123.45679')).toBe(123.46);
  });
});
