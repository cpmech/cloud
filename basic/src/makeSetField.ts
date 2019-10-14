// makeSetFiled makes a setField function
export const makeSetField = <T extends boolean | number | string>(
  obj: any,
  onChange: () => void,
  TT: T extends boolean
    ? 'boolean'
    : T extends number
    ? 'number'
    : T extends string
    ? 'string'
    : unknown,
) => (fieldName: string, value: T) => {
  // check if field exists
  if (!Object.prototype.hasOwnProperty.call(obj, fieldName)) {
    throw new Error(`cannot find ${fieldName}`);
  }

  // previous value
  const oldValue = obj[fieldName];

  // check if type is correct
  if (typeof oldValue !== TT) {
    throw new Error(`type of ${fieldName} is incorrect`);
  }

  // check if value has been changed
  if (oldValue !== value) {
    obj[fieldName] = value;
    onChange();
  }
};
