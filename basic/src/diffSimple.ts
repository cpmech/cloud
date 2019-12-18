import { Iany } from './types';
import { shallowCompareArrays } from './shallowCompareArrays';

// diffSimple (hierarchically) compares two objects and return true if they are different
// NOTE: (1) will NOT recurse into array
//       (2) arrays must NOT have mixed types or objects;
//       (3) arrays must only contain "simple" types
//       (4) simple means:  string, number, boolean
//           i.e arrays must be "simple" as string[], number[], boolean[]
//       (5) 'right' may have ore fields than 'left'
export const diffSimple = <T extends Iany, K extends keyof T>(left: T, right: T): boolean => {
  const keys = Object.keys(left) as K[];
  for (const key of keys) {
    const value = right[key];
    if (Array.isArray(value)) {
      if (!shallowCompareArrays(left[key], value)) {
        return true;
      }
    } else if (typeof value === 'object') {
      if (diffSimple(left[key], value)) {
        return true;
      }
    } else {
      if (left[key] !== value) {
        return true;
      }
    }
  }
  return false; // all equal
};
