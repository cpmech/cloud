export const filled = (entry: string): boolean => {
  if (entry === '' || entry === 'null') {
    return false;
  }
  return true;
};
