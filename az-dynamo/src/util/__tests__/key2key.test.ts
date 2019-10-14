import { key2ddbKey } from '../key2ddbKey';
import { IPrimaryKey } from '../../types';

describe('key2ddbKey', () => {
  it('converts keys properly', () => {
    const key1: IPrimaryKey = {
      email: 'dorival.pedroso@gmail.com',
    };
    const key2: IPrimaryKey = {
      email: 'dorival.pedroso@gmail.com',
      aspect: 'user', // sort key
    };
    expect(key2ddbKey(key1)).toEqual({
      email: { S: 'dorival.pedroso@gmail.com' },
    });
    expect(key2ddbKey(key2)).toEqual({
      email: { S: 'dorival.pedroso@gmail.com' },
      aspect: { S: 'user' },
    });
  });
});
