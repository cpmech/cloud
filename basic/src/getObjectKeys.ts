import { Iany } from './types';

// getObjectKeys (hierarchically) returns all keys (and subkeys) of an object
// NOTE: will not recurse into array
export const getObjectKeys = (obj: Iany, useBracesToIndicateNesting: boolean = true): string[] => {
  const results: string[] = [];
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    results.push(key);
    if (typeof value === 'object' && !Array.isArray(value)) {
      if (useBracesToIndicateNesting) {
        results.push('{');
      }
      getObjectKeys(value, useBracesToIndicateNesting).forEach(v => results.push(v));
      if (useBracesToIndicateNesting) {
        results.push('}');
      }
    }
  }
  return results;
};
