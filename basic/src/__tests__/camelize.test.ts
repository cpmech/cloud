import { camelize } from '../index';

describe('camelize (firstUpper is false)', () => {
  test('dorival_pedroso => dorivalPedroso', () => {
    expect(camelize('dorival_pedroso')).toBe('dorivalPedroso');
  });

  test('dorival_PEDROSO => dorivalPedroso', () => {
    expect(camelize('dorival_PEDROSO')).toBe('dorivalPedroso');
  });

  test('DORIVAL pedroso => dorivalPedroso', () => {
    expect(camelize('DORIVAL pedroso', false, ' ')).toBe('dorivalPedroso');
  });

  test('doriVAL@pedrOSO => dorivalPedroso', () => {
    expect(camelize('doriVAL@pedrOSO', false, '@')).toBe('dorivalPedroso');
  });
});

describe('camelize (firstUpper is true)', () => {
  test('dorival_pedroso => DorivalPedroso', () => {
    expect(camelize('dorival_pedroso', true)).toBe('DorivalPedroso');
  });

  test('dorival_PEDROSO => DorivalPedroso', () => {
    expect(camelize('dorival_PEDROSO', true)).toBe('DorivalPedroso');
  });

  test('DORIVAL pedroso => DorivalPedroso', () => {
    expect(camelize('DORIVAL pedroso', true, ' ')).toBe('DorivalPedroso');
  });

  test('doriVAL@pedrOSO => DorivalPedroso', () => {
    expect(camelize('dorival@pedroso', true, '@')).toBe('DorivalPedroso');
  });
});

describe('camelize (already camelized => will mess up)', () => {
  test('logoInc => logoinc', () => {
    expect(camelize('logoInc')).toBe('logoinc');
  });
});
