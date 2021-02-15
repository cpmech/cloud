import { camelize } from '../index';

describe('camelize (firstUpper is false)', () => {
  test('dorival_pedroso => dorivalPedroso', () => {
    expect(camelize('dorival_pedroso')).toBe('dorivalPedroso');
  });

  test('dorival_PEDROSO => dorivalPedroso', () => {
    expect(camelize('dorival_PEDROSO')).toBe('dorivalPedroso');
  });

  test('DORIVAL pedroso => dorivalPedroso', () => {
    expect(camelize('DORIVAL pedroso', false)).toBe('dorivalPedroso');
  });

  test('dorival@pedroso => dorivalPedroso', () => {
    expect(camelize('dorival@pedroso', false)).toBe('dorivalPedroso');
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
    expect(camelize('DORIVAL pedroso', true)).toBe('DorivalPedroso');
  });

  test('doriVAL@pedrOSO => DorivalPedroso', () => {
    expect(camelize('dorival@pedroso', true)).toBe('DorivalPedroso');
  });

  test('logoWhatsapp => logoWhatsapp', () => {
    expect(camelize('logoWhatsapp')).toBe('logoWhatsapp');
  });
});
