import { isEmailValid } from '../isEmailValid';

// Ref: https://flaviocopes.com/how-to-validate-email-address-javascript/

// NOTE: Some of flavio's valid emails have been removed

const goodEmails = [
  'something@something.com',
  'something@something.name',
  'something@something.name.com',
  'something@some-thing.startups',
  'someone@localhost.localdomain',
  'a/b@domain.com',
  '{}@domain.com',
  'tu!!7n7.ad##0!!!@company.ca',
  '%@com.com',
  'someone@do-ma-in.com',
  '"testblah"@example.com',
  'a@b.b',
  'simple@example.com',
  'very.common@example.com',
  'disposable.style.email.with+symbol@example.com',
  'other.email-with-dash@example.com',
  'fully-qualified-domain@example.com',
  'user.name+tag+sorting@example.com',
  'x@example.com',
  'example-indeed@strange-example.com',
  'example@s.solutions',
  'customer/department@example.com',
  '1234567890123456789012345678901234567890123456789012345678901234+x@example.com',
  'someone@127.0.0.1',
  'tester+test#01@here.com',
];

const badEmails = [
  'asfasdfas',
  'somebody@example',
  'somebody.example',
  '.wooly@example.com',
  'wo..oly@example.com',
  ' a@p.com',
  'a@p.com ',
  'test()@somebody.example',
  'test..x@somebody.example',
  'test..@somebody.example',
  'invalid:email@example.com',
  '@somewhere.com',
  'example.com',
  '@@example.com',
  'a space@example.com',
  'something@ex..ample.com',
  'a\b@c',
  '""test\blah""@example.com',
  'someone@somewhere.com@',
  'someone@somewhere.com@somewhere.com',
  'someone@somewhere_com',
  'someone@some:where.com',
  '.',
  'F/s/f/a@feo+re.com',
  'some+long+email+address@some+host-weird-/looking.com',
  'a @p.com',
  'ddjk-s-jk@asl-.com',
  'someone@do-.com',
  'somebody@-p.com',
  'somebody@-.com',
  'Abc.example.com',
  'A@b@c@example.com',
  'a"b(c)d,e:f;g<h>i[jk]l@example.com',
  'just"not"right@example.com ',
  'this is"notallowed@example.com',
  'this still"not\\allowed@example.com',
  'john..doe@example.com ',
  'john.doe@example..com ',
];

describe('validEmail', () => {
  it('should return true to (maybe) valid email addresses', () => {
    goodEmails.forEach(email => expect(isEmailValid(email)).toBeTruthy());
  });

  it('should return false to some invalid email addresses', () => {
    badEmails.forEach(email => expect(isEmailValid(email)).toBeFalsy());
  });
});
