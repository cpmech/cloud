import { arrayAny2type } from '../arrayany2type';
import { Iany } from '../types';

jest.spyOn(global.console, 'log').mockImplementation((msg: any) => msg);

interface Isubtype {
  p: string;
  q: { r: number };
}

interface Itype {
  alpha: string;
  beta: number;
  gamma: boolean;
  delta: Isubtype;
}

const reference: Itype = {
  alpha: '', // string
  beta: 0, // number
  gamma: false, // boolean
  delta: { p: '', q: { r: 0 } },
};

const correct1: Iany[] = [];

const correct2 = [
  {
    alpha: 'alpha',
    beta: 123,
    gamma: true,
    delta: { p: 'pval', q: { r: 666 } },
  },
];

const correct3 = [
  {
    alpha: 'alpha',
    beta: 123,
    gamma: true,
    delta: { p: 'pval', q: { r: 666 } },
  },
  {
    alpha: 'the-alpha',
    beta: 456,
    gamma: false,
    delta: { p: 'the-pval', q: { r: -666 } },
  },
];

const wrong1 = [
  {
    alpha: 'alpha',
    beta: '123', // <<<< error
    gamma: true,
    delta: { p: 'pval', q: { r: 666 } },
  },
];

const wrong2 = [
  {
    alpha: 'alpha',
    beta: 123,
    gamma: true,
    delta: { p: 123, q: { r: 666 } }, // <<< error on p
  },
];

const wrong3 = [
  {
    alpha: 'alpha',
    beta: 123,
    gamma: true,
    delta: { p: 'pval', q: { r: '666' } }, // <<< error on r
  },
];

const wrong4 = [
  {
    alpha: 'alpha',
    beta: 123,
    gamma: true,
    delta: { p: 'pval', q: { r: 666 } },
  },
  {
    alpha: 'alpha',
    beta: 123,
    gamma: true,
    delta: { p: 'pval', q: { r: '666' } }, // <<< error on r
  },
];

describe('arrayAny2type', () => {
  test('empty array always works', () => {
    const res1 = arrayAny2type(reference, correct1);
    if (res1) {
      expect(res1.length).toBe(0);
    } else {
      fail();
    }
  });

  test('correct objects work', () => {
    expect(arrayAny2type(reference, correct2)).toEqual(correct2);
    expect(arrayAny2type(reference, correct3)).toEqual(correct3);
  });

  test('wrong objects fail', () => {
    expect(arrayAny2type(reference, wrong1)).toEqual(null);
    expect(arrayAny2type(reference, wrong2)).toEqual(null);
    expect(arrayAny2type(reference, wrong3)).toEqual(null);
    expect(arrayAny2type(reference, wrong4)).toEqual(null);
  });
});

describe('arrayAny2type (verbose mode)', () => {
  test('wrong objects fail', () => {
    expect(arrayAny2type(reference, wrong1, true)).toEqual(null);
  });
});
