import { IBasic } from './types';

// shallowCompareArrays returns true if two arrays are equal to each other
// NOTE: the type of the array entries must be "fundamental"
export const shallowCompareArrays = <T extends IBasic>(left: T[], right: T[]) => {
  if (left.length !== right.length) {
    return false;
  }

  for (let i = 0; i < left.length; i++) {
    if (left[i] !== right[i]) {
      return false;
    }
  }

  return true;
};
