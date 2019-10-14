export const isPrimitive = (value: string): boolean => {
  if (value === 'Int') {
    return true;
  }
  if (value === 'Float') {
    return true;
  }
  if (value === 'String') {
    return true;
  }
  if (value === 'Boolean') {
    return true;
  }
  if (value === 'ID') {
    return true;
  }
  return false;
};
