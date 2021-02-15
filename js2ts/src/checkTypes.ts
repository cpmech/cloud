import { Iany } from './types';
import { logErr } from './logErr';
import { checkType } from './checkType';

/**
 * checkTypes hierarchically compares and array of 'any' to an array of 'reference'
 * @param reference - the aimed typed object
 * @param dataArray - the input array of 'Iany' to be 'typed'
 * @param optionalShallowFields - optional fields (shallow only)
 * @param verbose - show (nested) messages on errors
 * @returns the 'typed' array if ok; or null if the types are not compatible
 * @remarks
 * ```
 * 1. The objects in the 'data' array may contain more fields than the 'reference' object
 * 2. Only the first fields may be optional (shallow)
 * 3. It doesn't matter if the entries in optionalShallowFields are true or false
 * ```
 */
export function checkTypes<T extends Iany>(
  reference: T,
  dataArray: Iany[] | null,
  optionalShallowFields?: { [key in keyof T]?: boolean },
  verbose = false,
): null | T[] {
  // check for non-null target
  if (!dataArray) {
    if (verbose) {
      logErr(dataArray);
    }
    return null; // failed
  }

  // empty array
  if (dataArray.length === 0) {
    return []; // ok
  }

  // check each single item
  for (const item of dataArray) {
    const res = checkType(reference, item, optionalShallowFields, verbose);
    if (res === null) {
      return null; // failed
    }
  }

  // success
  return dataArray as T[];
}
