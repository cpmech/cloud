import seedrandom from 'seedrandom';

export let random = Math.random;

// fixSeed fixes the seed
export const fixSeed = (seed: string) => {
  random = seedrandom(seed);
};

// intFloat generates float in [min, max)
export const fltRnd = (min: number, max: number): number => random() * (max - min) + min;

// intRnd generates integer in [min, max)
export const intRnd = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive
};

// intRandom generates integer in [0, max)
export const intRandom = (max: number): number => {
  return Math.floor(random() * Math.floor(max));
};

// intShuffle shuffles a slice of integers
export const intShuffle = (values: number[]) => {
  let j = 0;
  let tmp = 0;
  for (let i = values.length - 1; i > 0; i--) {
    j = intRandom(values.length);
    tmp = values[j];
    values[j] = values[i];
    values[i] = tmp;
  }
};

// intGetShuffled returns a shufled slice of integers
export const intGetShuffled = (values: number[]): number[] => {
  const shuffled: number[] = values.slice();
  intShuffle(shuffled);
  return shuffled;
};

// intGetUnique randomly selects n items in a list avoiding duplicates
//  Note: using the 'reservoir sampling' method; see Wikipedia:
//        https://en.wikipedia.org/wiki/Reservoir_sampling
export const intGetUnique = (values: number[], n: number): number[] => {
  if (n < 1) {
    return [];
  }
  if (n >= values.length) {
    return intGetShuffled(values);
  }
  const selected: number[] = new Array(n);
  for (let i = 0; i < n; i++) {
    selected[i] = values[i];
  }
  let j: number = 0;
  for (let i = n; i < values.length; i++) {
    j = intRandom(i + 1);
    if (j < n) {
      selected[j] = values[i];
    }
  }
  return selected;
};

// generate padded number
export const rndX = (max: string): string =>
  intRandom(Number(max))
    .toFixed()
    .padStart(max.length, '0');

// FlipCoin generates a Bernoulli variable; throw a coin with probability p
export const flipCoin = (p: number): boolean => {
  if (p === 1.0) {
    return true;
  }
  if (p === 0.0) {
    return false;
  }
  if (random() <= p) {
    return true;
  }
  return false;
};
