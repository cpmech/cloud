import { Iany } from '@cpmech/basic';

export const empty2blank = <T extends Iany>(obj: T, empty = '__EMPTY__'): T =>
  Object.keys(obj).reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: obj[curr] === empty ? '' : obj[curr],
    }),
    {} as T,
  );
