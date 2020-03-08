import { formatLongNumber, formatNumber, cleanNumber } from '../formatNumber';

describe('formatLongNumber', () => {
  it('should place commas (or dots) in long nubmer', () => {
    expect(formatLongNumber('12345678')).toBe('12,345,678');
    expect(formatLongNumber('12345678', '.')).toBe('12.345.678');
  });
});

describe('formatNumber', () => {
  it('should format (currency) number with numDigits only', () => {
    expect(formatNumber('')).toBe('');
    expect(formatNumber('', true)).toBe('');
    expect(formatNumber('1234')).toBe('1,234');
    expect(formatNumber('1234', true)).toBe('1.234');
    expect(formatNumber('1234.56')).toBe('1,234.56');
    expect(formatNumber('1234,56', true)).toBe('1.234,56');
    expect(formatNumber('1234.567')).toBe('1,234.56');
    expect(formatNumber('1234,567', true)).toBe('1.234,56');
    expect(formatNumber('1234.5678')).toBe('1,234.56');
    expect(formatNumber('1234,5678', true)).toBe('1.234,56');
    expect(formatNumber('.5678')).toBe('0.56');
    expect(formatNumber(',5678', true)).toBe('0,56');
    expect(formatNumber('0.5678')).toBe('0.56');
    expect(formatNumber('0,5678', true)).toBe('0,56');
    expect(formatNumber('0.5678', false, 4)).toBe('0.5678');
    expect(formatNumber('0,5678', true, 4)).toBe('0,5678');
    expect(formatNumber('0.5678', false, 2, '$ ')).toBe('$ 0.56');
    expect(formatNumber('0,5678', true, 2, 'R$ ')).toBe('R$ 0,56');
  });
});

describe('cleanNumber', () => {
  it('should remove formatting', () => {
    expect(cleanNumber('')).toBe('');
    expect(cleanNumber('', true)).toBe('');
    expect(cleanNumber('1,234')).toBe('1234');
    expect(cleanNumber('1.234', true)).toBe('1234');
    expect(cleanNumber('1,234.56')).toBe('1234.56');
    expect(cleanNumber('1.234,56', true)).toBe('1234.56');
    expect(cleanNumber('1,234.5678')).toBe('1234.5678');
    expect(cleanNumber('1.234,5678', true)).toBe('1234.5678');
    expect(cleanNumber('... 1,234.56', false, '...')).toBe('1234.56');
    expect(cleanNumber('... 1.234,56', true, '...')).toBe('1234.56');
  });
});
