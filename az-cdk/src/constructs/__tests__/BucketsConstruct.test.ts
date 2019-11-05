import { App, Stack } from '@aws-cdk/core';
import { synthAppString } from '../../helpers/synthApp';
import { BucketsConstruct } from '../BucketsConstruct';

describe('BucketsConstruct ', () => {
  it('synthetizes properly', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new BucketsConstruct(stack, 'Buckets', {
      bucketNames: ['balde', 'deposito'],
    });
    expect(synthAppString(app)).toMatchSnapshot();
  });
});
