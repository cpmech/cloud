import { makeGetField } from '../makeGetField';

describe('makeGetField', () => {
  const obj = {
    fieldBoolean: true,
    fieldNumber: 123,
    fieldString: 'myname',
  };
  const b = makeGetField<boolean>(obj, 'boolean');
  const n = makeGetField<number>(obj, 'number');
  const s = makeGetField<string>(obj, 'string');

  it('should return the value correctly', () => {
    expect(b('fieldBoolean')).toBeTruthy();
    expect(n('fieldNumber')).toBe(123);
    expect(s('fieldString')).toBe('myname');
  });

  it('should throw error on inexistent fieldName', () => {
    expect(() => b('__none__')).toThrowError('cannot find __none__');
    expect(() => n('__none__')).toThrowError('cannot find __none__');
    expect(() => s('__none__')).toThrowError('cannot find __none__');
  });

  it('should throw error on incorrect type', () => {
    expect(() => b('fieldString')).toThrowError('type of fieldString is incorrect');
    expect(() => n('fieldBoolean')).toThrowError('type of fieldBoolean is incorrect');
    expect(() => s('fieldNumber')).toThrowError('type of fieldNumber is incorrect');
  });
});
