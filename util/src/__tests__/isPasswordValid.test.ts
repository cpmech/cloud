import { isPasswordValid } from '../isPasswordValid';

const wrong = ['', ' ', 'password', 'Password', 'Pa$$word', 'pa$$w0rd'];

const correct = ['Pa$$w0rd', '1carro$violeTA'];

describe('isPwdValid', () => {
  it('should return false on wrong passwords', () => {
    wrong.forEach(pwd => expect(isPasswordValid(pwd)).toBeFalsy());
  });

  it('should return true on correct passwords', () => {
    correct.forEach(pwd => expect(isPasswordValid(pwd)).toBeTruthy());
  });
});
