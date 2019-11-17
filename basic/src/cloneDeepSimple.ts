import { Iany } from './types';

// cloneDeepSimple (hierarchically) creates a copy of "simple" entries of object
// NOTE: (1) will NOT recurse into array
//       (2) must only contain arrays of "simple" types
//       (3) simple means:  string, number, boolean
export const cloneDeepSimple = (obj: Iany): Iany => {
  const results: Iany = {};
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (Array.isArray(value)) {
      results[key] = [...value];
    } else if (typeof value === 'object') {
      results[key] = cloneDeepSimple(value);
    } else {
      results[key] = value;
    }
  }
  return results;
};
