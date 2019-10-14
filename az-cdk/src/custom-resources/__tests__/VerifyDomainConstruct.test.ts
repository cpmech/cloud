import { App, Stack } from '@aws-cdk/core';
import { VerifyDomainConstruct } from '../VerifyDomainConstruct';
import { synthAppString } from '../../helpers/synthApp';

describe('VerifyDomainConstruct ', () => {
  it('synthetizes properly', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new VerifyDomainConstruct(stack, 'VerifyDomain', {
      hostedZoneId: '<hosted-zone-id>',
      domain: 'mydomain.com',
    });
    expect(synthAppString(app)).toMatchSnapshot();
  });
});
