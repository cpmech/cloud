// oKeys returns a typed array with the keys of an object
export const objKeys = <T extends object>(obj: T) => Object.keys(obj) as Array<keyof T>;
