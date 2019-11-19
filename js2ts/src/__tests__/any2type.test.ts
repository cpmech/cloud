import { any2type } from '../any2type';

jest.spyOn(global.console, 'log').mockImplementation((msg: any) => msg);

interface Isubtype {
  p: string;
  q: { r: { s: number; list: string[] }; nums: number[] };
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
  delta: { p: '', q: { r: { s: 0, list: ['', ''] }, nums: [0, 0] } },
};

const correct1 = {
  alpha: 'alpha',
  beta: 123,
  gamma: true,
  delta: { p: 'pval', q: { r: { s: 666, list: ['abra', 'kadabra'] }, nums: [123, 456] } },
};

const correct2 = {
  alpha: 'alpha',
  beta: 123,
  gamma: true,
  delta: {
    p: 'pval',
    q: {
      r: { s: 666, t: 'more props', more: 'more, more, more', list: ['abra', 'kadabra'] },
      nums: [123, 456],
    },
  },
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

const wrong9 = {
  alpha: 'alpha',
  beta: 123,
  gamma: true,
  delta: {
    p: 'pval',
    q: {
      r: { s: 666, t: 'more props', more: 'more, more, more', list: 'this goes in' }, // not array
      nums: [101, 202],
    },
  },
};

const ref1 = {
  first: '',
  second: '',
  third: 0,
};

const ref2 = {
  first: '',
  second: {
    third: 0,
  },
};

const ref3 = {
  super: '',
  hello: '',
  ultra: { nested: { structure: '', many: '', in: { it: -100 } } },
  array: ['', '', '', '', ''],
};

const obj1 = {
  first: '1',
  second: '2',
  third: 3,
};

const obj2 = {
  first: '1',
  second: {
    third: 3,
  },
};

const obj3 = {
  super: 'super',
  hello: 'world',
  ultra: { nested: { structure: 'with', many: 'things', in: { it: 0 } } },
  array: ['a', '1', 'b', 'c', '666'], // nust not have mixed types or objects
};

describe('any2type', () => {
  it('should clone object (typed) without modifying the referece nor the origin', () => {
    expect(any2type(reference, correct1)).toEqual(correct1);
    expect(any2type(reference, correct2)).toEqual(correct1);
    expect(any2type(ref1, obj1)).toEqual({
      first: '1',
      second: '2',
      third: 3,
    });
    expect(any2type(ref2, obj2)).toEqual({
      first: '1',
      second: {
        third: 3,
      },
    });
    expect(any2type(ref3, obj3)).toEqual({
      super: 'super',
      hello: 'world',
      ultra: { nested: { structure: 'with', many: 'things', in: { it: 0 } } },
      array: ['a', '1', 'b', 'c', '666'], // nust not have mixed types or objects
    });

    // reference should be intact
    expect(reference).toEqual({
      alpha: '', // string
      beta: 0, // number
      gamma: false, // boolean
      delta: { p: '', q: { r: { s: 0, list: ['', ''] }, nums: [0, 0] } },
    });
    expect(ref1).toEqual({
      first: '',
      second: '',
      third: 0,
    });
    expect(ref2).toEqual({
      first: '',
      second: {
        third: 0,
      },
    });
    expect(ref3).toEqual({
      super: '',
      hello: '',
      ultra: { nested: { structure: '', many: '', in: { it: -100 } } },
      array: ['', '', '', '', ''],
    });

    // originals should be intact
    expect(correct1).toEqual({
      alpha: 'alpha',
      beta: 123,
      gamma: true,
      delta: { p: 'pval', q: { r: { s: 666, list: ['abra', 'kadabra'] }, nums: [123, 456] } },
    });
    expect(correct2).toEqual({
      alpha: 'alpha',
      beta: 123,
      gamma: true,
      delta: {
        p: 'pval',
        q: {
          r: { s: 666, t: 'more props', more: 'more, more, more', list: ['abra', 'kadabra'] },
          nums: [123, 456],
        },
      },
    });
    expect(obj1).toEqual({
      first: '1',
      second: '2',
      third: 3,
    });
    expect(obj2).toEqual({
      first: '1',
      second: { third: 3 },
    });
    expect(obj3).toEqual({
      super: 'super',
      hello: 'world',
      ultra: { nested: { structure: 'with', many: 'things', in: { it: 0 } } },
      array: ['a', '1', 'b', 'c', '666'],
    });
  });

  it('should fail with wrong objects', () => {
    expect(any2type(reference, wrong1)).toEqual(null);
    expect(any2type(reference, wrong2)).toEqual(null);
    expect(any2type(reference, wrong3)).toEqual(null);
    expect(any2type(reference, wrong4)).toEqual(null);
    expect(any2type(reference, wrong5)).toEqual(null);
    expect(any2type(reference, wrong6)).toEqual(null);
    expect(any2type(reference, wrong7)).toEqual(null);
    expect(any2type(reference, wrong8)).toEqual(null);
    expect(any2type(reference, wrong9)).toEqual(null);
  });

  test('null object fails', () => {
    expect(any2type(reference, null)).toEqual(null);
  });

  it('modfifying the copy should not affect the original object', () => {
    const res1 = any2type(ref1, obj1);
    if (!res1) {
      fail('res1 is null');
      return;
    }
    res1.first += '_modified';
    res1.second += '_modified';
    res1.third += 663;
    expect(res1).toEqual({
      first: '1_modified',
      second: '2_modified',
      third: 666,
    });
    expect(obj1).toEqual({
      first: '1',
      second: '2',
      third: 3,
    });

    const res2 = any2type(ref2, obj2);
    if (!res2) {
      fail('res2 is null');
      return;
    }
    res2.first += '_modified';
    res2.second.third += 663;
    expect(res2).toEqual({
      first: '1_modified',
      second: { third: 666 },
    });
    expect(obj2).toEqual({
      first: '1',
      second: { third: 3 },
    });

    const res3 = any2type(ref3, obj3);
    if (!res3) {
      fail('res3 is null');
      return;
    }
    res3.super += '_modified';
    res3.hello += '_modified';
    res3.ultra.nested.structure += '_mod';
    res3.ultra.nested.many += '_mod';
    res3.ultra.nested.in.it += 123;
    res3.array[0] += '_mod';
    res3.array[1] += '_mod';
    res3.array[2] += '_mod';
    res3.array[3] += '_mod';
    res3.array[4] += '_mod';
    expect(res3).toEqual({
      super: 'super_modified',
      hello: 'world_modified',
      ultra: { nested: { structure: 'with_mod', many: 'things_mod', in: { it: 123 } } },
      array: ['a_mod', '1_mod', 'b_mod', 'c_mod', '666_mod'],
    });
    expect(obj3).toEqual({
      super: 'super',
      hello: 'world',
      ultra: { nested: { structure: 'with', many: 'things', in: { it: 0 } } },
      array: ['a', '1', 'b', 'c', '666'],
    });
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
