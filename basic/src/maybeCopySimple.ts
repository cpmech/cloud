import { Iany } from './types';
import { hasProp } from './hasProp';

// maybeCopySimple (hierarchically) copies some data from origin
// into destination, iff the origin data exists (not undefined / not null)
// but it does copy empty strings and numbers
// NOTE: (1) will NOT recurse into array
//       (2) arrays must NOT have mixed types or objects;
//       (3) arrays must only contain "simple" types
//       (4) simple means:  string, number, boolean
//           i.e arrays must be "simple" as string[], number[], boolean[]
export const maybeCopySimple = (destination: Iany, origin: Iany) => {
  for (const key of Object.keys(destination)) {
    if (hasProp(origin, key)) {
      const value = origin[key];
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          (destination as any)[key] = value.slice(0);
        } else if (typeof value === 'object') {
          maybeCopySimple(destination[key], value);
        } else {
          (destination as any)[key] = value;
        }
      }
    }
  }
};
