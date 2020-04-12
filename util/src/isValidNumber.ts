export const isValidNumber = (x: number | string): boolean => {
  if (x === '') {
    return false;
  }
  const val = Number(x);
  if (isNaN(val) || !isFinite(val)) {
    return false;
  }
  return true;
};
