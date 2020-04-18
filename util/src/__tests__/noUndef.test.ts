import { noUndef } from '../noUndef';

describe('noUndef', () => {
  it('should remove entries with undefined values', () => {
    interface IMyType {
      first: number;
      second: number;
      third?: string;
      fourth?: boolean;
    }
    const obj: IMyType = {
      first: 1,
      second: 2,
      third: undefined,
      fourth: undefined,
    };
    const res = noUndef(obj);
    expect(res).toStrictEqual({ first: 1, second: 2 });
  });
});
