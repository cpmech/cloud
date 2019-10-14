import { any2type } from '../any2type';

jest.spyOn(global.console, 'log').mockImplementation((msg: any) => msg);

interface Isubtype {
  p: string;
  q: { r: { s: number } };
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
  delta: { p: '', q: { r: { s: 0 } } },
};

const correct1 = {
  alpha: 'alpha',
  beta: 123,
  gamma: true,
  delta: { p: 'pval', q: { r: { s: 666 } } },
};

const correct2 = {
  alpha: 'alpha',
  beta: 123,
  gamma: true,
  delta: { p: 'pval', q: { r: { s: 666, t: 'more props' } } },
};

const wrong1 = {
  alpha: 'alpha',
  beta: 123,
  gamma: true,
  delta: { p: 'pval', q: { r: { s: '666' } } },
};

const wrong2 = {};

const wrong3 = {
  alpha: 'alpha',
};

const wrong4 = {
  alpha: 123,
};

const wrong5 = {
  alpha: { a: 123 },
};

const wrong6 = {
  delta: { p: 'pval', q: { r: { s: 666 } } },
};

const wrong7 = {
  alpha: 'alpha',
  beta: '123',
  gamma: true,
  delta: { p: 'pval', q: { r: { s: 666 } } },
};

const wrong8 = {
  alpha: 'alpha',
  beta: 123,
  gamma: true,
  delta: { p: 456, q: { r: { s: 666 } } },
};

describe('any2type', () => {
  test('correct objects work', () => {
    expect(any2type(reference, correct1)).toEqual(correct1);
    expect(any2type(reference, correct2)).toEqual(correct1);
  });

  test('wrong objects fail', () => {
    expect(any2type(reference, wrong1)).toEqual(null);
    expect(any2type(reference, wrong2)).toEqual(null);
    expect(any2type(reference, wrong3)).toEqual(null);
    expect(any2type(reference, wrong4)).toEqual(null);
    expect(any2type(reference, wrong5)).toEqual(null);
    expect(any2type(reference, wrong6)).toEqual(null);
    expect(any2type(reference, wrong7)).toEqual(null);
    expect(any2type(reference, wrong8)).toEqual(null);
  });

  test('null object fails', () => {
    expect(any2type(reference, null)).toEqual(null);
  });
});

describe('any2type (verbose mode)', () => {
  test('wrong objects fail', () => {
    expect(any2type(reference, wrong2, true)).toEqual(null);
  });

  test('null object fails', () => {
    expect(any2type(reference, null, true)).toEqual(null);
  });
});
