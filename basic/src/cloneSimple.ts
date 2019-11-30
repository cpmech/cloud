import { Iany } from './types';

// cloneSimple (hierarchically) creates a copy of "simple" entries of object
// NOTE: (1) will NOT recurse into array
//       (2) arrays must NOT have mixed types or objects;
//       (3) arrays must only contain "simple" types
//       (4) simple means:  string, number, boolean
//           i.e arrays must be "simple" as string[], number[], boolean[]
export const cloneSimple = <T extends Iany>(obj: T): T =>
  Object.keys(obj).reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: Array.isArray(obj[curr])
        ? obj[curr].slice(0)
        : typeof obj[curr] === 'object'
        ? cloneSimple(obj[curr])
        : obj[curr],
    }),
    {} as T,
  );
