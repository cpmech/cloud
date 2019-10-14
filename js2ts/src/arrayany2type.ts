import { Iany } from './types';
import { any2type } from './any2type';

// arrayAny2type converts 'target' array of any object to an array of objects with
// the type specified by 'reference'. returns null on failure
// NOTE: (1) 'target' can have more properties than 'reference' (they'll be ignored)
//       (2) this function is recursive (when a property is an object)
//       (3) if 'target' is an empty array => it's valid
export function arrayAny2type<T extends Iany>(
  reference: T,
  target: Iany[],
  verbose: boolean = false,
): null | T[] {
  // empty array
  if (target.length === 0) {
    return [];
  }

  // loop over items
  let results: T[] = [];
  for (let i = 0; i < target.length; i++) {
    const item = any2type(reference, target[i], verbose);
    if (item) {
      results.push(item);
    } else {
      return null;
    }
  }

  // results
  return results;
}
