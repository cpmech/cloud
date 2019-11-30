import { Iany } from '@cpmech/basic';

export const blank2empty = <T extends Iany>(obj: T, empty = '__EMPTY__'): T =>
  Object.keys(obj).reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: obj[curr] ? obj[curr] : empty,
    }),
    {} as T,
  );
