// check if object has prop
export function hasProp(object: any, propertyName: string): boolean {
  return Object.prototype.hasOwnProperty.call(object, propertyName);
}
