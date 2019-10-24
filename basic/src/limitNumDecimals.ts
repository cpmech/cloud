// this function will remove excess decimal digits by truncating the value
// NOTE: this function will round up or down
export const limitNumDecimals = (val: number | string, maxDigits = 2): number => {
  return Number(Number.parseFloat(String(val)).toFixed(maxDigits));
};
