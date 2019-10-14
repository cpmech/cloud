export const hasProp = (object: any, propertyName: string): boolean => {
  return Object.prototype.hasOwnProperty.call(object, propertyName);
};
