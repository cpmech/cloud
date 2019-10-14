import { filled } from './filled';

// allFilled checks if all 'root-level' properties of object are filled (not '', not 'null')
export const allFilled = (obj: any, ignoredKeys?: string[]): boolean => {
  let keys: string[];
  if (ignoredKeys) {
    keys = Object.keys(obj).filter(key => !ignoredKeys.includes(key));
  } else {
    keys = Object.keys(obj);
  }
  for (const key of keys) {
    if (!filled(obj[key])) {
      return false;
    }
  }
  return true;
};
