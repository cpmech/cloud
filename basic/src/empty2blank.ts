import { Iany } from './types';

// empty2blank will replace empty with '' recursively on SIMPLE objects
// NOTE: (1) will NOT recurse into array
//       (2) arrays must NOT have mixed types or objects;
//       (3) arrays must only contain "simple" types
//       (4) simple means:  string, number, boolean
//           i.e arrays must be "simple" as string[], number[], boolean[]
export const empty2blank = <T extends Iany>(obj: T, empty = '__EMPTY__'): T =>
  Object.keys(obj).reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: !!!obj[curr] // null or undefined
        ? ''
        : Array.isArray(obj[curr])
        ? obj[curr].map((x: any) => (x === empty ? '' : x))
        : typeof obj[curr] === 'object' && !Array.isArray(obj[curr])
        ? empty2blank(obj[curr], empty)
        : obj[curr] === empty
        ? ''
        : obj[curr],
    }),
    {} as T,
  );
