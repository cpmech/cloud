import { Iany } from './types';
import { hasSameProp } from './helpers';
import { logErr } from './logErr';

// any2type (hierarchically) clones (most) entries of 'origin'
// It also converts 'origin' object to type specified by 'reference'.
// It returns null on failure.
// NOTE: (1) 'origin' can have more properties than 'reference' (they'll be ignored)
//       (2) this function is recursive (when a property is an object)
//       (3) will NOT recurse into array
//       (4) arrays must NOT have mixed types or objects;
//       (5) arrays must only contain "simple" types
//       (6) simple means:  string, number, boolean
//           i.e arrays must be "simple" as string[], number[], boolean[]
//       (7) optional fields can only handle shallow (first) fields
export function any2type<T extends Iany>(
  reference: T,
  origin: Iany | null,
  verbose: boolean = false,
  optionalShallowFields?: { [key in keyof T]?: boolean },
): null | T {
  // check for non-null target
  if (!origin) {
    if (verbose) {
      logErr(origin);
    }
    return null;
  }

  // start with empty results => will be filled with reference's keys
  const results: Iany = {};

  // keys of reference
  const keys = Object.keys(reference);

  // loop over each key of reference
  for (const key of keys) {
    // skip optional fields if NOT present
    if (optionalShallowFields) {
      if (optionalShallowFields[key] && !Object.prototype.hasOwnProperty.call(origin, key)) {
        continue;
      }
    }

    // check if target has the key and the property has the same type as reference
    if (!hasSameProp(reference, origin, key)) {
      if (verbose) {
        logErr(origin, key);
      }
      return null;
    }

    // new value
    const value = origin[key];

    // perform copy
    if (Array.isArray(reference[key])) {
      results[key] = value.slice(0);
    } else if (typeof reference[key] === 'object') {
      const res = any2type(reference[key], value, verbose);
      if (!res) {
        return null;
      }
      results[key] = res;
    } else {
      results[key] = value;
    }
  }

  // results
  return results as T;
}
