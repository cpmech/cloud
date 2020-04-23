import { date2values, values2date, values2errors, dateTranslationPt } from '../dates';

describe('date2values', () => {
  it('should convert date-string to IDateValues', () => {
    expect(date2values('2020-04-23')).toStrictEqual({ year: '2020', month: '04', day: '23' });
    expect(date2values('2020-02-29')).toStrictEqual({ year: '2020', month: '02', day: '29' });
    expect(date2values('2020-04-23T05:23:18.170Z')).toStrictEqual({
      year: '2020',
      month: '04',
      day: '23',
    });
    expect(date2values('2020-04-21T16:16:50.304')).toStrictEqual({
      year: '2020',
      month: '04',
      day: '21',
    });
  });
  it('should handle incorrect input', () => {
    expect(date2values('')).toStrictEqual({ year: '', month: '', day: '' });
    expect(date2values('.')).toStrictEqual({ year: '', month: '', day: '' });
    expect(date2values('asdfasdf')).toStrictEqual({ year: '', month: '', day: '' });
    expect(date2values('2020/04/23')).toStrictEqual({ year: '', month: '', day: '' });
    expect(date2values('23-04-2020')).toStrictEqual({ year: '', month: '', day: '' });
    expect(date2values('2020-02-30')).toStrictEqual({ year: '', month: '', day: '' });
  });
});

describe('values2date', () => {
  it('should convert values to ISO date string', () => {
    expect(values2date({ year: '2020', month: '4', day: '23' })).toBe('2020-04-23');
    expect(values2date({ year: '2020', month: '4', day: '2' })).toBe('2020-04-02');
    expect(values2date({ year: '2020', month: '4', day: '02' })).toBe('2020-04-02');
    expect(values2date({ year: '2020', month: '04', day: '2' })).toBe('2020-04-02');
    expect(values2date({ year: '2020', month: '04', day: '02' })).toBe('2020-04-02');
    expect(values2date({ year: '2020', month: '2', day: '29' })).toBe('2020-02-29');
    expect(values2date({ year: '2020', month: '02', day: '29' })).toBe('2020-02-29');
  });
  it('should capture errors', () => {
    expect(values2date({ year: '2020', month: '02', day: '30' })).toBe('');
  });
});

describe('values2errors', () => {
  it('should return empty errors and the ISO date for correct input', () => {
    expect(values2errors({ year: '2020', month: '4', day: '23' })).toStrictEqual({
      errors: {
        year: '',
        month: '',
        day: '',
        date: '',
      },
      date: '2020-04-23',
    });
    expect(values2errors({ year: '2020', month: '04', day: '2' })).toStrictEqual({
      errors: {
        year: '',
        month: '',
        day: '',
        date: '',
      },
      date: '2020-04-02',
    });
  });
  it('should return error messages (EN) and no date', () => {
    expect(values2errors({ year: '', month: '04', day: '23' })).toStrictEqual({
      errors: {
        year: 'Please enter year (4 digits)',
        month: '',
        day: '',
        date: '',
      },
      date: '',
    });
    expect(values2errors({ year: '2020', month: '', day: '23' })).toStrictEqual({
      errors: {
        year: '',
        month: 'Please enter month',
        day: '',
        date: '',
      },
      date: '',
    });
    expect(values2errors({ year: '2020', month: '04', day: '' })).toStrictEqual({
      errors: {
        year: '',
        month: '',
        day: 'Please enter day',
        date: '',
      },
      date: '',
    });
    expect(values2errors({ year: '2020', month: '02', day: '30' })).toStrictEqual({
      errors: {
        year: '',
        month: '',
        day: '',
        date: 'Date 2020-02-30 is invalid',
      },
      date: '',
    });
    expect(values2errors({ year: '2020', month: '2', day: '30' })).toStrictEqual({
      errors: {
        year: '',
        month: '',
        day: '',
        date: 'Date 2020-02-30 is invalid',
      },
      date: '',
    });
  });
  it('should return error messages (PT) and no date', () => {
    expect(values2errors({ year: '', month: '04', day: '23' }, dateTranslationPt)).toStrictEqual({
      errors: {
        year: 'Por favor entrar o ano (4 dígitos)',
        month: '',
        day: '',
        date: '',
      },
      date: '',
    });
    expect(values2errors({ year: '2020', month: '', day: '23' }, dateTranslationPt)).toStrictEqual({
      errors: {
        year: '',
        month: 'Por favor entrar o mês',
        day: '',
        date: '',
      },
      date: '',
    });
    expect(values2errors({ year: '2020', month: '04', day: '' }, dateTranslationPt)).toStrictEqual({
      errors: {
        year: '',
        month: '',
        day: 'Por favor entrar o dia',
        date: '',
      },
      date: '',
    });
    expect(
      values2errors({ year: '2020', month: '02', day: '30' }, dateTranslationPt),
    ).toStrictEqual({
      errors: {
        year: '',
        month: '',
        day: '',
        date: 'A data 2020-02-30 é inválida',
      },
      date: '',
    });
    expect(values2errors({ year: '2020', month: '2', day: '30' }, dateTranslationPt)).toStrictEqual(
      {
        errors: {
          year: '',
          month: '',
          day: '',
          date: 'A data 2020-02-30 é inválida',
        },
        date: '',
      },
    );
  });
});
