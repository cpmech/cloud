import { Iany } from './types';
import { hasSameProp } from './helpers';
import { logErr } from './logErr';

/**
 * checkType hierarchically compares 'any' to a 'reference'
 * @param reference - the aimed typed object
 * @param data - the input 'Iany' data to be 'typed'
 * @param optionalShallowFields - optional fields (shallow only)
 * @param verbose - show (nested) messages on errors
 * @returns the 'typed' object if ok; or null if the types are not compatible
 * @remarks
 * ```
 * 1. The 'data' object may contain more fields than the 'reference' object
 * 2. Only the first fields may be optional (shallow)
 * 3. It doesn't matter if the entries in optionalShallowFields are true or false
 * 4. This function is recursive
 * ```
 */
export function checkType<T extends Iany>(
  reference: T,
  data: Iany | null,
  optionalShallowFields?: { [key in keyof T]?: boolean },
  verbose = false,
): null | T {
  // check for non-null target
  if (!data) {
    if (verbose) {
      logErr(data);
    }
    return null; // failed
  }

  // compare keys and types, hierarchically
  for (const key of Object.keys(reference)) {
    if (optionalShallowFields) {
      if (Object.prototype.hasOwnProperty.call(optionalShallowFields, key)) {
        continue; // skip optional key
      }
    }
    if (!hasSameProp(reference, data, key as keyof T)) {
      return null;
    }
    const subref = reference[key];
    if (Array.isArray(subref)) {
      if (subref.length !== 1) {
        throw new Error('each reference array must contain a single item');
      }
      const subdata = data[key];
      if (!Array.isArray(subdata)) {
        return null; // failed
      }
      const subsubref = subref[0];
      for (const subsubdata of subdata) {
        const res = checkType(subsubref, subsubdata, undefined, verbose);
        if (res === null) {
          return null; // failed
        }
      }
    } else if (typeof subref === 'object') {
      const subdata = data[key];
      const res = checkType(subref, subdata, undefined, verbose);
      if (res === null) {
        return null; // failed
      }
    }
  }

  // success
  return data as T;
}
