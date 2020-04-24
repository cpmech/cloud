import { cloneSimple } from './cloneSimple';
import { IMapOfList } from './types';

export const appendToMapOfList = (a: IMapOfList, key: string, item: any) => {
  if (a[key]) {
    a[key].push(item);
  } else {
    a[key] = [item];
  }
};

export const mergeMapList = (a: IMapOfList, b: IMapOfList): IMapOfList => {
  const results = cloneSimple(a);
  Object.keys(b).forEach((key) => {
    if (results[key]) {
      results[key] = results[key].concat(b[key]);
    } else {
      results[key] = b[key];
    }
  });
  return results;
};
