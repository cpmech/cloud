import { Iany } from './types';

// cloneSimple (hierarchically) creates a copy of "simple" entries of object
// NOTE: (1) will NOT recurse into array
//       (2) arrays must NOT have mixed types or objects;
//       (3) arrays must only contain "simple" types
//       (4) simple means:  string, number, boolean
//           i.e arrays must be "simple" as string[], number[], boolean[]
export const cloneSimple = (obj: Iany): Iany => {
  const results: Iany = {};
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (Array.isArray(value)) {
      results[key] = value.slice(0);
    } else if (typeof value === 'object') {
      results[key] = cloneSimple(value);
    } else {
      results[key] = value;
    }
  }
  return results;
};
