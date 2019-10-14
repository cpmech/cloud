import { getObjectKeys } from '../getObjectKeys';

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
  array: [{ hello: 'array' }],
};

describe('getObjectKeys', () => {
  it('should return the correct array of keys', () => {
    expect(getObjectKeys(obj1)).toEqual(['first', 'second', 'third']);
    expect(getObjectKeys(obj2)).toEqual(['first', 'second', '{', 'third', '}']);
    expect(getObjectKeys(obj3)).toEqual([
      'super',
      'hello',
      'ultra',
      '{',
      'nested',
      '{',
      'structure',
      'many',
      'in',
      '{',
      'it',
      '}',
      '}',
      '}',
      'array',
    ]);
  });

  it('no-braces: should return the correct array of keys', () => {
    expect(getObjectKeys(obj3, false)).toEqual([
      'super',
      'hello',
      'ultra',
      'nested',
      'structure',
      'many',
      'in',
      'it',
      'array',
    ]);
  });
});
