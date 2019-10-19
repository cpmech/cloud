import { Locales } from '../Locales';

const resources = {
  en: {
    hello: 'Hello World',
    home: {
      title: 'Main page',
    },
    err: {
      internal: 'INTERNAL_ERROR: Some problem happened, please contact us',
    },
  },
  pt: {
    hello: 'Alô Mundo',
    home: {
      title: 'Página principal',
    },
    err: {
      internal: 'ERRO_INTERNO: Aconteceu algum problema, por favor nos contactar',
    },
  },
};

describe('Locales', () => {
  it('should return error on missing locale', () => {
    const l = new Locales(resources, 'jp');
    const t = l.translate;
    expect(t('hello')).toBe('INTERNAL_ERROR: cannot find locale jp in resources object');
  });

  it('should return error on missing path and defaultMessage', () => {
    const l = new Locales(resources);
    const t = l.translate;
    expect(t('')).toBe('INTERNAL_ERROR: path variable must not be empty');
  });

  it('should return localized message on default conditions', () => {
    const l = new Locales(resources);
    const t = l.translate;
    expect(t('home.title')).toBe('Main page');
  });

  it('should return default message on mising message', () => {
    const l = new Locales(resources);
    const t = l.translate;
    expect(t('placeholder', 'Work in progress...')).toBe('Work in progress...');
  });

  it('should return error message on mising message', () => {
    const l = new Locales(resources);
    const t = l.translate;
    expect(t('placeholder')).toBe('INTERNAL_ERROR: cannot find message with path = placeholder');
  });

  it('should get the locale', () => {
    const l = new Locales(resources);
    expect(l.getLocale()).toBe('en');
  });

  it('should set the locale', () => {
    const l = new Locales(resources);
    const t = l.translate;
    l.setLocale('pt');
    expect(l.getLocale()).toBe('pt');
    expect(t('home.title')).toBe('Página principal');
  });

  it('should get the country', () => {
    const l = new Locales(resources);
    expect(l.getCountry()).toBe('us');
  });

  it('should set the country', () => {
    const l = new Locales(resources);
    l.setCountry('br');
    expect(l.getCountry()).toBe('br');
  });

  it('should get index of day', () => {
    const l = new Locales(resources, 'en', 'us');
    expect(l.getIndexDay()).toBe(1);
    l.setCountry('br');
    expect(l.getIndexDay()).toBe(0);
  });

  it('should get index of month', () => {
    const l = new Locales(resources, 'en', 'us');
    expect(l.getIndexMonth()).toBe(0);
    l.setCountry('br');
    expect(l.getIndexMonth()).toBe(1);
  });

  it('should get firstFieldMax', () => {
    const l = new Locales(resources, 'en', 'us');
    expect(l.getFirstFieldMax()).toBe(12);
    l.setCountry('br');
    expect(l.getFirstFieldMax()).toBe(31);
  });

  it('should get firstFieldMax', () => {
    const l = new Locales(resources, 'en', 'us');
    expect(l.getSecondFieldMax()).toBe(31);
    l.setCountry('br');
    expect(l.getSecondFieldMax()).toBe(12);
  });

  it('should get dateFormat', () => {
    const l = new Locales(resources, 'en', 'us');
    expect(l.getDateFormat()).toBe('MM/DD/YYYY');
    l.setCountry('br');
    expect(l.getDateFormat()).toBe('DD/MM/YYYY');
  });
});
