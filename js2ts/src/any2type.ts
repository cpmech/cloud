import { Iany } from './types';
import { hasSameProp } from './helpers';
import { logErr } from './logErr';

// any2type converts 'target' object to type specified by 'reference'. returns null on failure
// NOTE: (1) 'target' can have more properties than 'reference' (they'll be ignored)
//       (2) this function is recursive (when a property is an object)
export function any2type<T extends Iany>(
  reference: T,
  target: Iany | null,
  verbose: boolean = false,
): null | T {
  // check for non-null target
  if (!target) {
    if (verbose) {
      logErr(target);
    }
    return null;
  }

  // make a copy of reference
  let results: T = { ...reference };

  // keys of reference
  const keys = Object.keys(reference) as Array<keyof T>;

  // loop over each key of reference
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    // check if target has the key and the property has the same type as reference
    if (!hasSameProp(reference, target, key)) {
      if (verbose) {
        logErr(target, key as string);
      }
      return null;
    }

    // check if property is object => recursion
    if (typeof reference[key] === 'object') {
      const res = any2type(reference[key], target[key as string]);
      if (!res) {
        return null;
      }
      results[key] = { ...res };
    } else {
      results[key] = target[key as string];
    }
  }

  // results
  return results;
}
