import { Stack } from '@aws-cdk/core';
import { ssmSecret } from '../ssmSecret';

describe('ssmSecret', () => {
  it('synthetizes properly', () => {
    const stack = new Stack();
    const secret = ssmSecret({ name: 'HELLO', version: '123' });
    const res = stack.resolve(secret);
    expect(res).toBe('{{resolve:ssm:HELLO:123}}');
  });
});
