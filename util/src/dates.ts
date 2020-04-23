import { isValidPositiveNumber } from './isValidPositiveNumber';

export interface IDateTranslation {
  year: string;
  month: string;
  day: string;
  date: string;
  errorYear: string;
  errorMonth: string;
  errorDay: string;
  errorDate: string;
}

export const dateTranslationEn: IDateTranslation = {
  year: 'Year',
  month: 'Month',
  day: 'Day',
  date: 'Date',
  errorYear: 'Please enter year (4 digits)',
  errorMonth: 'Please enter month',
  errorDay: 'Please enter day',
  errorDate: 'Date {{date}} is invalid',
};

export const dateTranslationPt: IDateTranslation = {
  year: 'Ano',
  month: 'Mês',
  day: 'Dia',
  date: 'Data',
  errorYear: 'Por favor entrar o ano (4 dígitos)',
  errorMonth: 'Por favor entrar o mês',
  errorDay: 'Por favor entrar o dia',
  errorDate: 'A data {{date}} é inválida',
};

export interface IDateValues {
  year: string; // 4-digits
  month: string;
  day: string;
}

export interface IDateVerrors {
  year: string;
  month: string;
  day: string;
  date: string;
}

// returns empty on errors
export const date2values = (dateISO: string): IDateValues => {
  const date = dateISO.split('T')[0];
  if (!date) {
    return { year: '', month: '', day: '' };
  }
  const [year, month, day] = date.split('-');
  if (
    !year ||
    !month ||
    !day ||
    !isValidPositiveNumber(year) ||
    !isValidPositiveNumber(month) ||
    !isValidPositiveNumber(day)
  ) {
    return { year: '', month: '', day: '' };
  }
  const d = new Date(date); // must not use dateISO, otherwise the timezone will kick in
  if (
    d.getFullYear() !== Number(year) ||
    d.getMonth() + 1 !== Number(month) ||
    d.getDate() !== Number(day)
  ) {
    return { year: '', month: '', day: '' };
  }
  return { year, month, day };
};

// returns empty on errors
export const values2date = (values: IDateValues): string => {
  const month = values.month.padStart(2, '0');
  const day = values.day.padStart(2, '0');
  const date = `${values.year}-${month}-${day}`;
  const d = new Date(date);
  const ok =
    d.getFullYear() === Number(values.year) &&
    d.getMonth() + 1 === Number(values.month) &&
    d.getDate() === Number(values.day);
  if (!ok) {
    return '';
  }
  return date;
};

export const values2errors = (
  values: IDateValues,
  translation = dateTranslationEn,
): { errors: IDateVerrors; date: string } => {
  const errors: IDateVerrors = {
    year: values.year && values.year.length === 4 ? '' : translation.errorYear,
    month: values.month && values.month !== '0' ? '' : translation.errorMonth,
    day: values.day && values.day !== '0' ? '' : translation.errorDay,
    date: '',
  };
  if (errors.year || errors.month || errors.day) {
    return { errors, date: '' };
  }
  const date = values2date(values);
  if (!date) {
    errors.date = translation.errorDate.replace(
      '{{date}}',
      `${values.year}-${values.month.padStart(2, '0')}-${values.day.padStart(2, '0')}`,
    );
  }
  return { errors, date };
};
