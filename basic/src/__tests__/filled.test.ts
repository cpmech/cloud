import { filled } from '../filled';

describe('filled', () => {
  it('empty variable is handled properly', () => {
    const empty = '';
    expect(filled(empty)).toBeFalsy();
  });

  it('variable with "null" is handled properly', () => {
    const empty = 'null';
    expect(filled(empty)).toBeFalsy();
  });

  it('filled variable is handled properly', () => {
    const empty = 'something';
    expect(filled(empty)).toBeTruthy();
  });
});
