import { hasProp } from './hasProp';
import { Iany } from './types';

// Locales helps to extract localized messages an a resources object such as:
//   const resources = {
//     en: {
//       hello: 'Hello World',
//       home: {
//         title: 'Main page',
//       },
//       err: {
//         internal: 'INTERNAL_ERROR: Some problem happened, please contact us',
//       },
//     },
//     pt: {
//       hello: 'Alô Mundo',
//       home: {
//         title: 'Página principal',
//       },
//       err: {
//         internal: 'ERRO_INTERNO: Aconteceu algum problema, por favor nos contactar',
//       },
//     },
//   };
export class Locales {
  private resources: Iany;
  private locale: string;
  private country: string;

  // NOTE: resources is stored "byRef"
  constructor(resources: Iany, locale: string = 'en', country: string = 'us') {
    this.resources = resources;
    this.locale = locale;
    this.country = country;
  }

  getLocale = (): string => this.locale;

  setLocale = (locale: string) => (this.locale = locale);

  getCountry = (): string => this.country;

  setCountry = (country: string) => (this.country = country);

  getIndexDay = (): number => (this.country === 'us' ? 1 : 0);

  getIndexMonth = (): number => (this.country === 'us' ? 0 : 1);

  getFirstFieldMax = (): number => (this.country === 'us' ? 12 : 31);

  getSecondFieldMax = (): number => (this.country === 'us' ? 31 : 12);

  getDateFormat = (): string => (this.country === 'us' ? 'MM/DD/YYYY' : 'DD/MM/YYYY');

  translate = (path: string, defaultMessage: string = ''): string => {
    // check for locale in resources
    if (!hasProp(this.resources, this.locale)) {
      return `INTERNAL_ERROR: cannot find locale ${this.locale} in resources object`;
    }

    // resources
    const res = this.resources[this.locale];

    // check for path
    if (!path) {
      return 'INTERNAL_ERROR: path variable must not be empty';
    }

    // extract localized message
    const list = path.split('.');
    const msg = list.reduce((acc, curr) => {
      if (hasProp(acc, curr)) {
        return acc[curr];
      }
      return '';
    }, res);

    // default message?
    if (!msg) {
      return defaultMessage || `INTERNAL_ERROR: cannot find message with path = ${path}`;
    }

    // results
    return msg;
  };
}
