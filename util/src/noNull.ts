import { Iany } from '@cpmech/basic';
import { objKeys } from './objKeys';

// removes entries with null values
export const noNull = <T extends Iany>(obj: T): T => {
  return objKeys(obj).reduce((acc, key) => {
    if (obj[key] === null) {
      return acc;
    }
    return {
      ...acc,
      [key]: obj[key],
    };
  }, {} as T);
};
