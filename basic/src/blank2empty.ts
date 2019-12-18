import { Iany } from './types';

// blank2empty will replace '' with empty recursively on SIMPLE objects
// NOTE: (1) will NOT recurse into array
//       (2) arrays must NOT have mixed types or objects;
//       (3) arrays must only contain "simple" types
//       (4) simple means:  string, number, boolean
//           i.e arrays must be "simple" as string[], number[], boolean[]
//       (5) null or undefined will be converted to EMPTY
export const blank2empty = <T extends Iany>(obj: T, empty = '__EMPTY__'): T =>
  Object.keys(obj).reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: !!!obj[curr] // null or undefined
        ? empty
        : Array.isArray(obj[curr])
        ? obj[curr].map((x: any) => (!!x ? x : empty))
        : typeof obj[curr] === 'object' && !Array.isArray(obj[curr])
        ? blank2empty(obj[curr], empty)
        : !!obj[curr]
        ? obj[curr]
        : empty,
    }),
    {} as T,
  );
