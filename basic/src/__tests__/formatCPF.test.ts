import { formatCPF } from '../formatCPF';

describe('formatCPF', () => {
  it('should return formatted CPF', () => {
    expect(formatCPF('123.123.666')).toBe('123.123.666');
    expect(formatCPF('123.123.666.55')).toBe('123.123.666-55');
    expect(formatCPF('12312366655')).toBe('123.123.666-55');
  });
});
