// makeGetField makes a getField function
export const makeGetField = <T extends boolean | number | string>(
  obj: any,
  TT: T extends boolean
    ? 'boolean'
    : T extends number
    ? 'number'
    : T extends string
    ? 'string'
    : unknown,
) => (fieldName: string): T => {
  // check if field exists
  if (!Object.prototype.hasOwnProperty.call(obj, fieldName)) {
    throw new Error(`cannot find ${fieldName}`);
  }

  // check if type is correct
  const value = obj[fieldName];
  if (typeof value !== TT) {
    throw new Error(`type of ${fieldName} is incorrect`);
  }

  // results
  return value as T;
};
