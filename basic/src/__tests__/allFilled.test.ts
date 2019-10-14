import { allFilled } from '../allFilled';

describe('allFilled', () => {
  it('all empty variables are handled properly', () => {
    const obj = {
      a: '',
      b: '',
      c: '',
    };
    expect(allFilled(obj)).toBeFalsy();
  });

  it('some empty variables are handled properly', () => {
    const obj = {
      a: 'a',
      b: '',
      c: 'c',
    };
    expect(allFilled(obj)).toBeFalsy();
  });

  it('empty and "null" variables are handled properly', () => {
    const obj = {
      a: '',
      b: 'null',
      c: '',
    };
    expect(allFilled(obj)).toBeFalsy();
  });

  it('all "null" variables are handled properly', () => {
    const obj = {
      a: 'null',
      b: 'null',
      c: 'null',
    };
    expect(allFilled(obj)).toBeFalsy();
  });

  it('some "null" variables are handled properly', () => {
    const obj = {
      a: 'a',
      b: 'null',
      c: 'c',
    };
    expect(allFilled(obj)).toBeFalsy();
  });

  it('all ok variables are handled properly', () => {
    const obj = {
      a: 'a',
      b: 'b',
      c: 'c',
    };
    expect(allFilled(obj)).toBeTruthy();
  });

  it('all variables are handled properly, ignoring prop', () => {
    const obj = {
      a: 'a',
      b: 'b',
      c: '',
      d: 'null',
    };
    expect(allFilled(obj, ['c', 'd'])).toBeTruthy();
  });
});
