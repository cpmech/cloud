export const isValidPositiveNumber = (x: number | string): boolean => {
  const val = Number(x);
  if (isNaN(val) || !isFinite(val)) {
    return false;
  }
  if (val <= 0) {
    return false;
  }
  return true;
};
