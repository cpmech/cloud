import { shallowCompareArrays } from '../shallowCompareArrays';

describe.only('shallowCompareArrays', () => {
  it('should return true for two equal arrays of boolean', () => {
    const left = [true, false, true, false, true, true];
    const right = [true, false, true, false, true, true];
    expect(shallowCompareArrays(left, right)).toBeTruthy();
  });

  it('should return true for two equal arrays of number', () => {
    const left = [1, 2, 3, 4, 5];
    const right = [1, 2, 3, 4, 5];
    expect(shallowCompareArrays(left, right)).toBeTruthy();
  });

  it('should return true for two equal arrays of strings', () => {
    const left = ['a', 'b', 'c', 'd', 'e'];
    const right = ['a', 'b', 'c', 'd', 'e'];
    expect(shallowCompareArrays(left, right)).toBeTruthy();
  });

  it('should return false for arrays with different length', () => {
    const left = [1, 2, 3, 4, 5];
    const right = [1, 2, 3, 4];
    expect(shallowCompareArrays(left, right)).toBeFalsy();
  });

  it('should return false for different arrays', () => {
    const left = [1, 2, 3, 4, 5];
    const right = [1, 2, 3, 4, 666];
    expect(shallowCompareArrays(left, right)).toBeFalsy();
  });
});
