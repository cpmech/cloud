import { makeSetField } from '../makeSetField';

const obj = {
  fieldBoolean: true,
  fieldNumber: 123,
  fieldString: 'hello',
};

let bFlag = 'original';
let nFlag = 'original';
let sFlag = 'original';

const bChange = () => (bFlag = 'modified');
const nChange = () => (nFlag = 'modified');
const sChange = () => (sFlag = 'modified');

beforeEach(() => {
  obj.fieldBoolean = true;
  obj.fieldNumber = 123;
  obj.fieldString = 'hello';
  bFlag = 'original';
  nFlag = 'original';
  sFlag = 'original';
});

describe('makeSetField', () => {
  const b = makeSetField<boolean>(obj, bChange, 'boolean');
  const n = makeSetField<number>(obj, nChange, 'number');
  const s = makeSetField<string>(obj, sChange, 'string');

  it('should set the value if it is different than the current value', () => {
    b('fieldBoolean', false);
    n('fieldNumber', 666);
    s('fieldString', 'world');
    expect(obj).toEqual({
      fieldBoolean: false,
      fieldNumber: 666,
      fieldString: 'world',
    });
    expect(bFlag).toBe('modified');
    expect(nFlag).toBe('modified');
    expect(sFlag).toBe('modified');
  });

  it('should not set the value if it is equal to the current value', () => {
    b('fieldBoolean', true);
    n('fieldNumber', 123);
    s('fieldString', 'hello');
    expect(obj).toEqual({
      fieldBoolean: true,
      fieldNumber: 123,
      fieldString: 'hello',
    });
    expect(bFlag).toBe('original');
    expect(nFlag).toBe('original');
    expect(sFlag).toBe('original');
  });

  it('should throw error on none fieldName', () => {
    expect(() => b('__none__', false)).toThrowError('cannot find __none__');
    expect(() => n('__none__', 666)).toThrowError('cannot find __none__');
    expect(() => s('__none__', 'hello')).toThrowError('cannot find __none__');
    expect(bFlag).toBe('original');
    expect(nFlag).toBe('original');
    expect(sFlag).toBe('original');
  });

  it('should throw error on incorrect type', () => {
    expect(() => b('fieldString', false)).toThrowError('type of fieldString is incorrect');
    expect(() => n('fieldBoolean', 666)).toThrowError('type of fieldBoolean is incorrect');
    expect(() => s('fieldNumber', 'hello')).toThrowError('type of fieldNumber is incorrect');
    expect(bFlag).toBe('original');
    expect(nFlag).toBe('original');
    expect(sFlag).toBe('original');
  });
});
