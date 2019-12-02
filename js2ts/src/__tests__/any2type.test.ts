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

const correct1missing = {
  alpha: 'alpha',
  beta: 123,
  gamma: true,
};

const wrong1 = {
  alpha: 'alpha',
  beta: 123,
  gamma: true,
  delta: { p: 'pval', q: { r: { s: '666' } } }, // list and nums are missing
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
    expect(any2type(reference2, { a: 'a', b: 123, c: true })).toEqual({ a: 'a', b: 123, c: true });
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
    expect(any2type(reference2, { a: 123, b: '123', c: true })).toBeNull();
    expect(any2type(reference, wrong1)).toBeNull();
    expect(any2type(reference, wrong2)).toBeNull();
    expect(any2type(reference, wrong3)).toBeNull();
    expect(any2type(reference, wrong4)).toBeNull();
    expect(any2type(reference, wrong5)).toBeNull();
    expect(any2type(reference, wrong6)).toBeNull();
    expect(any2type(reference, wrong7)).toBeNull();
    expect(any2type(reference, wrong8)).toBeNull();
    expect(any2type(reference, wrong9)).toBeNull();
  });

  test('null object fails', () => {
    expect(any2type(reference, null)).toBeNull();
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
    expect(any2type(reference, wrong2, true)).toBeNull();
  });

  test('null object fails', () => {
    expect(any2type(reference, null, true)).toBeNull();
  });
});

interface Itype2 {
  a: string;
  b?: number;
  c?: boolean;
}

const reference2: Itype2 = {
  a: '',
  b: 0,
  c: false,
};

const type2correct1 = {
  a: 'present',
  b: 123,
  c: true,
};

const type2correct2 = {
  a: 'present',
  b: 123,
};

const type2correct3 = {
  a: 'present',
};

const type2correct4 = {};

const type2correct5 = {
  b: 123,
};

const type2wrong1 = {
  a: 'present',
  b: 123,
  c: 123,
};

const type2wrong2 = {
  b: '123',
};

const type2wrong3 = {
  a: 123,
};

describe('any2type (optional fields)', () => {
  it('should ignore optional fields and return all data if present', () => {
    expect(
      any2type(reference, correct1, false, { alpha: true, beta: true, gamma: true, delta: true }),
    ).toEqual(correct1);
    expect(any2type(reference2, type2correct1, false, { c: true })).toEqual(type2correct1);
  });

  it('should return null (error) if optional fields are present but wrong', () => {
    expect(any2type(reference, wrong1, false, { beta: true, delta: true })).toBeNull();
    expect(any2type(reference, wrong7, false, { beta: true, delta: true })).toBeNull();
    expect(any2type(reference, wrong8, false, { beta: true, delta: true })).toBeNull();
    expect(any2type(reference, wrong9, false, { beta: true, delta: true })).toBeNull();
    expect(any2type(reference2, type2wrong1, false, { b: true, c: true })).toBeNull();
    expect(any2type(reference2, type2wrong2, false, { a: true, b: true, c: true })).toBeNull();
    expect(any2type(reference2, type2wrong3, false, { a: true, b: true, c: true })).toBeNull();
  });

  it('should skip optional fields if not present', () => {
    expect(any2type(reference, correct1missing, false, { delta: true })).toEqual(correct1missing);
    expect(any2type(reference2, type2correct2, false, { c: true })).toEqual(type2correct2);
    expect(any2type(reference2, type2correct3, false, { b: true, c: true })).toEqual(type2correct3);
    expect(any2type(reference2, type2correct4, false, { a: true, b: true, c: true })).toEqual(
      type2correct4,
    );
    expect(any2type(reference2, type2correct5, false, { a: true, b: true, c: true })).toEqual(
      type2correct5,
    );
  });
});
