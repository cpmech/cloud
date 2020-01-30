import { Iany } from '@cpmech/basic';
import { objKeys } from './objKeys';

// removes entries with undefined values
export const noUndef = <T extends Iany>(obj: T): T => {
  return objKeys(obj).reduce((acc, key) => {
    if (obj[key] === undefined) {
      return acc;
    }
    return {
      ...acc,
      [key]: obj[key],
    };
  }, {} as T);
};
