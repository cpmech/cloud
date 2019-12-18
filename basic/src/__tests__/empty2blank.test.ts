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
  data: null,
  extra: undefined,
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
      data: '',
      extra: '',
    });
  });
});
