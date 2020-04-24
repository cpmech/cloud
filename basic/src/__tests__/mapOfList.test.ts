import { appendToMapOfList, mergeMapList } from '../mapOfList';

describe('appendToMapOfList', () => {
  it('should append items in the right place', () => {
    const map1 = {
      list1: ['a', '1', 'b', 'c', '666'], // nust not have mixed types or objects
      list2: [1, 2, 3, 4, 5], // nust not have mixed types or objects
      list3: [true, false, true], // nust not have mixed types or objects
    };
    appendToMapOfList(map1, 'list1', 'xxxx');
    expect(map1).toStrictEqual({
      list1: ['a', '1', 'b', 'c', '666', 'xxxx'],
      list2: [1, 2, 3, 4, 5],
      list3: [true, false, true],
    });
    appendToMapOfList(map1, 'list2', 6);
    expect(map1).toStrictEqual({
      list1: ['a', '1', 'b', 'c', '666', 'xxxx'],
      list2: [1, 2, 3, 4, 5, 6],
      list3: [true, false, true],
    });
    appendToMapOfList(map1, 'list3', false);
    expect(map1).toStrictEqual({
      list1: ['a', '1', 'b', 'c', '666', 'xxxx'],
      list2: [1, 2, 3, 4, 5, 6],
      list3: [true, false, true, false],
    });
    appendToMapOfList(map1, 'list4', -1);
    expect(map1).toStrictEqual({
      list1: ['a', '1', 'b', 'c', '666', 'xxxx'],
      list2: [1, 2, 3, 4, 5, 6],
      list3: [true, false, true, false],
      list4: [-1],
    });
  });
});

describe('mergeMapList', () => {
  it('should merge maps and leve originals intact', () => {
    const map1 = {
      list1: ['a', '1', 'b', 'c', '666'], // nust not have mixed types or objects
      list2: [1, 2, 3, 4, 5], // nust not have mixed types or objects
      list3: [true, false, true], // nust not have mixed types or objects
    };
    const map2 = {
      list1: ['xxxx', 'more'],
      list2: [6, 7, 8],
      list3: [false],
      list4: [-1],
    };
    const res = mergeMapList(map1, map2);
    expect(map1).toStrictEqual({
      list1: ['a', '1', 'b', 'c', '666'],
      list2: [1, 2, 3, 4, 5],
      list3: [true, false, true],
    });
    expect(map2).toStrictEqual({
      list1: ['xxxx', 'more'],
      list2: [6, 7, 8],
      list3: [false],
      list4: [-1],
    });
    expect(res).toStrictEqual({
      list1: ['a', '1', 'b', 'c', '666', 'xxxx', 'more'],
      list2: [1, 2, 3, 4, 5, 6, 7, 8],
      list3: [true, false, true, false],
      list4: [-1],
    });
  });
});
