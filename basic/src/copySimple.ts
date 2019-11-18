import { Iany } from './types';

// copySimple (hierarchically) copies all entries of object into destination
// NOTE: (1) will NOT recurse into array
//       (2) arrays must NOT have mixed types or objects;
//       (3) arrays must only contain "simple" types
//       (4) simple means:  string, number, boolean
//           i.e arrays must be "simple" as string[], number[], boolean[]
export const copySimple = <T extends Iany, K extends keyof T>(destination: T, origin: T) => {
  const keys = Object.keys(destination) as K[];
  for (const key of keys) {
    const value = origin[key];
    if (Array.isArray(value)) {
      destination[key] = value.slice(0);
    } else if (typeof value === 'object') {
      copySimple(destination[key], value);
    } else {
      destination[key] = value;
    }
  }
};
