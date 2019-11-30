import { empty2blank } from '../empty2blank';

const files = {
  userId: 'iam-bender',
  aspect: 'FILES',
  hello: '__EMPTY__',
  world: '__EMPTY__',
  nested: {
    name: '__EMPTY__',
    email: '__EMPTY__',
  },
  list: [],
};

describe('empty2blank', () => {
  it('should replace EMPTY with blank strings', () => {
    expect(empty2blank(files)).toEqual({
      userId: 'iam-bender',
      aspect: 'FILES',
      hello: '',
      world: '',
      nested: {
        name: '',
        email: '',
      },
      list: [],
    });
  });
});
