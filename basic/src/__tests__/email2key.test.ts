import { email2key } from '../email2key';

describe('email2key', () => {
  it('works', () => {
    expect(email2key('test@domain.com')).toBe('test_domain_com');
    expect(email2key('name.test@domain.com')).toBe('name_test_domain_com');
    expect(email2key('hello.test@domain-crazy.com')).toBe('hello_test_domain-crazy_com');
    expect(email2key('test@domain_other.com')).toBe('test_domain_other_com');
    expect(email2key('test@domain.co.uk')).toBe('test_domain_co_uk');
    expect(email2key('hello.test@domain.edu.gov.uk.au')).toBe('hello_test_domain_edu_gov_uk_au');
  });
});
