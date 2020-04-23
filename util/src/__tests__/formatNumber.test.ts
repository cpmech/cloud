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
  it('should handle wrong input', () => {
    expect(formatNumber('')).toBe('');
    expect(formatNumber('a=aa')).toBe('');
    expect(formatNumber('123-456')).toBe('123,456');
    expect(formatNumber('0*123')).toBe('0,123');
    expect(formatNumber('0,134,0')).toBe('01,340');
    expect(formatNumber('-888')).toBe('888');
  });
});

describe('formatNumber (US)', () => {
  it('should return the right value', () => {
    expect(formatNumber('10.45.')).toBe('10.45');
    expect(formatNumber('1.0.45')).toBe('1.04');
    expect(formatNumber('1.0.45.')).toBe('1.04');
    expect(formatNumber('.')).toBe('0.');
    expect(formatNumber('00,000.1')).toBe('0.1');
    expect(formatNumber('.45')).toBe('0.45');
    expect(formatNumber('.45123')).toBe('0.45');
    expect(formatNumber('1234')).toBe('1,234');
    expect(formatNumber('12345678')).toBe('12,345,678');
    expect(formatNumber('1234.123')).toBe('1,234.12');
    expect(formatNumber('a1b2c3d4')).toBe('1,234');
    expect(formatNumber('12,34')).toBe('1,234');
    expect(formatNumber('$1234.456')).toBe('1,234.45');
  });
});

describe('formatNumber (BR)', () => {
  it('should return the right value', () => {
    expect(formatNumber('10,45,', true)).toBe('10,45');
    expect(formatNumber('1,0,45', true)).toBe('1,04');
    expect(formatNumber('1,0,45.', true)).toBe('1,04');
    expect(formatNumber(',', true)).toBe('0,');
    expect(formatNumber('00.000,1', true)).toBe('0,1');
    expect(formatNumber(',45', true)).toBe('0,45');
    expect(formatNumber(',45123', true)).toBe('0,45');
    expect(formatNumber('1234', true)).toBe('1.234');
    expect(formatNumber('12345678', true)).toBe('12.345.678');
    expect(formatNumber('1234,123', true)).toBe('1.234,12');
    expect(formatNumber('a1b2c3d4', true)).toBe('1.234');
    expect(formatNumber('12.34', true)).toBe('1.234');
    expect(formatNumber('$1234,456', true)).toBe('1.234,45');
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
});
