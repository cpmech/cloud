// reference:
// https://github.com/guilhermehn/gerar-cpf/blob/master/index.js

const mod = (x: number, y: number) => Math.round(x - Math.floor(x / y) * y);

const sumNumbers = (xs: number[]) =>
  xs
    .slice()
    .reverse()
    .reduce((acc, a, b) => acc + a * (b + 2), 0);

export const genCPF = (rng: () => number = Math.random, mask = 'xxx.xxx.xxx-xx') => {
  const numbers: number[] = [];
  while (numbers.length < 9) {
    numbers[numbers.length] = Math.round(rng() * 9);
  }
  while (numbers.length < 11) {
    let last = 11 - mod(sumNumbers(numbers), 11);
    if (last > 9) {
      last = 0;
    }
    numbers[numbers.length] = last;
  }
  const result = numbers.join('');
  if (!mask) {
    return result;
  }
  const placeholder = 'x';
  const placeholderRegex = new RegExp(placeholder);
  for (let i = 0; i < 11; i++) {
    mask = mask.replace(placeholderRegex, result[i]);
  }
  return mask;
};

const reduceNumbersForCPF = (numbers: number[], quantity: number): number =>
  numbers.slice(0, quantity).reduce((acc, curr, i) => acc + curr * (quantity + 1 - i), 0);

const calculateCheckDigit = (reducedNumbers: number): number => ((reducedNumbers * 10) % 11) % 10;

export const isValidCPF = (originalValue: string) => {
  const value = originalValue.replace(/[\D\s._\-]+/g, '');
  if (!value || value.length !== 11) {
    return false;
  }

  const asNumbers = value.split('').map(n => Number(n));

  // not repeated
  const set = new Set(asNumbers);
  if (set.size === 1) {
    return false;
  }

  const check1 = reduceNumbersForCPF(asNumbers, 9);
  if (calculateCheckDigit(check1) !== asNumbers[9]) {
    return false;
  }

  const check2 = reduceNumbersForCPF(asNumbers, 10);
  if (calculateCheckDigit(check2) !== asNumbers[10]) {
    return false;
  }

  return true;
};
