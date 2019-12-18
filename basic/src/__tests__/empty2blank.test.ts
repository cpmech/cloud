import { empty2blank } from '../empty2blank';

const obj1 = {
  userId: 'iam-bender',
  aspect: 'FILES',
  hello: 'Hello',
  world: '__EMPTY__',
  nested: {
    name: '__EMPTY__',
    email: '__EMPTY__',
    more: {
      notEmpty: 'not empty',
      empty: '__EMPTY__',
    },
  },
  list: ['__EMPTY__', '123', '456'],
  nums: [0, 0, 0, 1, 2, 3],
  data: null,
  extra: undefined,
  wrong: null,
  incorrect: undefined,
  x: 0,
  y: 666,
  z: [1, 2, 3],
  flag: false,
  ok: true,
};

describe('empty2blank', () => {
  it('should replace EMPTY with blank strings', () => {
    expect(empty2blank(obj1)).toEqual({
      userId: 'iam-bender',
      aspect: 'FILES',
      hello: 'Hello',
      world: '',
      nested: {
        name: '',
        email: '',
        more: {
          notEmpty: 'not empty',
          empty: '',
        },
      },
      list: ['', '123', '456'],
      nums: [0, 0, 0, 1, 2, 3],
      data: '',
      extra: '',
      wrong: '',
      incorrect: '',
      x: 0,
      y: 666,
      z: [1, 2, 3],
      flag: false,
      ok: true,
    });
  });

  it('should replace EMPTY with blank strings (keep undefined)', () => {
    expect(empty2blank(obj1, '__EMPTY__', true)).toEqual({
      userId: 'iam-bender',
      aspect: 'FILES',
      hello: 'Hello',
      world: '',
      nested: {
        name: '',
        email: '',
        more: {
          notEmpty: 'not empty',
          empty: '',
        },
      },
      list: ['', '123', '456'],
      nums: [0, 0, 0, 1, 2, 3],
      data: null,
      extra: undefined,
      wrong: null,
      incorrect: undefined,
      x: 0,
      y: 666,
      z: [1, 2, 3],
      flag: false,
      ok: true,
    });
  });
});
