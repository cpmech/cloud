import { fixSeed, random } from '@cpmech/rnd';
import { genCPF, isValidCPF } from '../cpf';

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
