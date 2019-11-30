import { blank2empty } from '../blank2empty';

const files = {
  userId: 'iam-bender',
  aspect: 'FILES',
  hello: '',
  world: '',
  nested: {
    name: '',
    email: '',
  },
  list: [],
};

describe('empty2blank', () => {
  it('should replace EMPTY with blank strings', () => {
    expect(blank2empty(files)).toEqual({
      userId: 'iam-bender',
      aspect: 'FILES',
      hello: '__EMPTY__',
      world: '__EMPTY__',
      nested: {
        name: '__EMPTY__',
        email: '__EMPTY__',
      },
      list: [],
    });
  });
});
