import { fixSeed, random } from '@cpmech/rnd';
import { genCPF, isValidCPF, formatCPF } from '../cpf';

beforeAll(() => {
  fixSeed('hello');
});

describe('cpf', () => {
  it('should generate and validate', () => {
    const r1 = [1, 2, 3, 4].map(n => genCPF(random));
    const r2 = r1.map(cpf => isValidCPF(cpf));
    expect(r1).toEqual(['545.749.869-72', '462.196.839-43', '166.654.551-14', '283.547.638-54']);
    expect(r2).toEqual([true, true, true, true]);
  });
});

describe('formatCPF', () => {
  it('should return formatted CPF', () => {
    expect(formatCPF('123.123.666')).toBe('123.123.666');
    expect(formatCPF('123.123.666.55')).toBe('123.123.666-55');
    expect(formatCPF('12312366655')).toBe('123.123.666-55');
  });
});
