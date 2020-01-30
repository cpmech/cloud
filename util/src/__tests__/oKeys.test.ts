import { oKeys } from '../oKeys';

describe('oKeys', () => {
  it('should return an array with the keys', () => {
    interface IMyType {
      first: number;
      second: number;
    }
    const obj: IMyType = { first: 1, second: 2 };
    const res = oKeys(obj);
    expect(obj[res[0]]).toBe(1); // typescript will not complain here
    expect(obj[res[1]]).toBe(2); // typescript will not complain here
    expect(res).toEqual(['first', 'second']);
  });
});
