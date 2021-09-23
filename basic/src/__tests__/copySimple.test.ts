import { copySimple } from '../copySimple';

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
  array: ['a', '1', 'b', 'c', '666'], // must not have mixed types or objects
};

describe('copySimple', () => {
  it('the copy should be equal to the original object', () => {
    const res1 = {
      first: '',
      second: '',
      third: 0,
    };
    const res2 = {
      first: '',
      second: {
        third: 0,
      },
    };
    const res3 = {
      super: '',
      hello: '',
      ultra: { nested: { structure: '', many: '', in: { it: -100 } } },
      array: [],
    };
    copySimple(res1, obj1);
    copySimple(res2, obj2);
    copySimple(res3, obj3);
    expect(res1).toEqual(obj1);
    expect(res2).toEqual(obj2);
    expect(res3).toEqual(obj3);
    // originals should be intact
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

  it('modfifying the copy should not affect the original object', () => {
    const res1 = {
      first: '',
      second: '',
      third: 0,
    };
    copySimple(res1, obj1);
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

    const res2 = {
      first: '',
      second: {
        third: 0,
      },
    };
    copySimple(res2, obj2);
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

    const res3 = {
      super: '',
      hello: '',
      ultra: { nested: { structure: '', many: '', in: { it: -100 } } },
      array: ['', '', '', '', ''],
    };
    copySimple(res3, obj3);
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
