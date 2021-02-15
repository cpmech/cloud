import camelcase from 'lodash.camelcase';

export const camelize = (name: string, firstUpper: boolean = false): string => {
  if (firstUpper) {
    return camelcase(name).replace(/./, (m) => m.toUpperCase());
  }
  return camelcase(name);
};
