import { Iany } from './types';

// getProp returns the property value given its key
export function getProp<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

// hasSameProp checks if 'target' has the same properties as 'reference'.
// check if the property is existent and also has the same type as reference
export function hasSameProp<A extends Iany, B extends Iany, K extends keyof A>(
  reference: A,
  target: B,
  key: K,
): boolean {
  // check if property exists
  if (!Object.prototype.hasOwnProperty.call(target, key)) {
    return false;
  }

  // check if the types match
  const typ = typeof reference[key];
  const val = (target as any)[key as string];
  if (typeof val !== typ) {
    return false;
  }
  return true;
}
