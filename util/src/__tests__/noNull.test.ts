import { noNull } from '../noNull';

describe('noNull', () => {
  it('should remove entries with null values', () => {
    interface IMyType {
      first: number;
      second: number;
      third: string | null;
      fourth: boolean | null;
    }
    const obj: IMyType = {
      first: 1,
      second: 2,
      third: null,
      fourth: null,
    };
    const res = noNull(obj);
    expect(res).toStrictEqual({ first: 1, second: 2 });
  });
});
