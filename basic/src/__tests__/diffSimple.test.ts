import { diffSimple } from '../diffSimple';

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

describe('diffSimple', () => {
  it('should return true for different objects', () => {
    const other1 = {
      first: '1',
      second: '2',
      third: 0,
      moreStuff1: 'I have more stuff', // ignored
    };
    const other2 = {
      first: '',
      second: {
        third: 3,
      },
      hello: 'world',
    };
    const other3 = {
      super: 'super',
      hello: 'world',
      ultra: { nested: { structure: 'with', many: 'things', in: { it: -100 } } },
      array: ['a', '1', 'b', 'c', '666'], // nust not have mixed types or objects
      anotherArray: ['a', 'n', 'o', 't', 'h', 'e', 'r'],
    };
    expect(diffSimple(obj1, other1)).toBeTruthy();
    expect(diffSimple(obj2, other2)).toBeTruthy();
    expect(diffSimple(obj3, other3)).toBeTruthy();
  });

  it('should return false for NOT different objects', () => {
    const other1 = {
      first: '1',
      second: '2',
      third: 3,
    };
    const other2 = {
      first: '1',
      second: {
        third: 3,
      },
    };
    const other3 = {
      super: 'super',
      hello: 'world',
      ultra: { nested: { structure: 'with', many: 'things', in: { it: 0 } } },
      array: ['a', '1', 'b', 'c', '666'],
    };
    expect(diffSimple(obj1, other1)).toBeFalsy();
    expect(diffSimple(obj2, other2)).toBeFalsy();
    expect(diffSimple(obj3, other3)).toBeFalsy();
  });

  it('should return true if one item in array is different', () => {
    const obj = {
      first: '1',
      second: '2',
      third: [1, 2, 3],
    };
    const other = {
      first: '1',
      second: '2',
      third: [1, 1, 3],
    };
    expect(diffSimple(obj, other)).toBeTruthy();
  });

  it('should allow the right object to have more keys', () => {
    expect(diffSimple({ a: 'a' }, { a: 'a', b: 'b' })).toBeFalsy();
    const left = {
      a: 'a',
      b: 'b',
    };
    const right = {
      a: 'a',
      b: 'b',
      c: 'c',
      d: 'd',
      e: 'e',
      f: 'f',
      g: 'g',
      h: 'h',
      i: 'i',
      j: 'j',
    };
    expect(diffSimple(left, right)).toBeFalsy();
  });
});
