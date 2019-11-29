import { App, Stack } from '@aws-cdk/core';
import { synthAppString } from '../../helpers/synthApp';
import { BucketsConstruct } from '../BucketsConstruct';

describe('BucketsConstruct ', () => {
  it('synthetizes properly', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new BucketsConstruct(stack, 'Buckets', {
      buckets: [{ name: 'balde' }, { name: 'deposito' }],
    });
    expect(synthAppString(app)).toMatchSnapshot();
  });

  it('synthetizes properly with CORS', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new BucketsConstruct(stack, 'Buckets', {
      buckets: [
        {
          name: 'balde',
          corsDELETE: true,
          corsGET: true,
          corsPOST: true,
          corsPUT: true,
        },
        {
          name: 'deposito',
          corsPUT: true,
        },
      ],
    });
    expect(synthAppString(app)).toMatchSnapshot();
  });
});
