import {
  fixSeed,
  fltRnd,
  intRnd,
  intRandom,
  intShuffle,
  intGetShuffled,
  intGetUnique,
  rndX,
  flipCoin,
} from '../random';

beforeAll(() => {
  fixSeed('hello');
});

describe('random', () => {
  it('should generate pseudo-random values', () => {
    const l1 = [1, 2, 3, 4, 5, 6];
    const r1 = [1, 2, 3].map(n => fltRnd(10, 20).toFixed(5));
    const r2 = [1, 2, 3].map(n => intRnd(10, 20));
    const r3 = [1, 2, 3].map(n => intRandom(10));
    const r4 = intGetShuffled(l1);
    intShuffle(l1);
    const r5 = intGetUnique(l1, 3);
    const r6 = rndX('99999');
    const r7 = [1, 2, 3].map(n => flipCoin(0.5));
    expect(r1).toEqual(['15.46366', '14.39738', '15.54769']);
    expect(r2).toEqual([17, 14, 19]);
    expect(r3).toEqual([9, 6, 9]);
    expect(r4).toEqual([6, 3, 1, 2, 4, 5]);
    expect(l1).toEqual([2, 1, 5, 3, 4, 6]);
    expect(r5).toEqual([2, 1, 3]);
    expect(r6).toEqual('59734');
    expect(r7).toEqual([true, false, false]);
  });
  it('should handle edge cases', () => {
    const l1 = [1, 2, 3, 4, 5, 6];
    const r1 = intGetUnique(l1, 0);
    const r2 = intGetUnique(l1, 20);
    const r3 = flipCoin(1);
    const r4 = flipCoin(0);
    expect(r1).toEqual([]);
    expect(r2).toEqual([6, 1, 3, 5, 2, 4]);
    expect(r3).toBeTruthy();
    expect(r4).toBeFalsy();
  });
});
