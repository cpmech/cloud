import { App, Stack } from '@aws-cdk/core';
import { Queue } from '@aws-cdk/aws-sqs';
import { synthApp, synthAppString } from '../synthApp';

const reference = {
  Resources: {
    TheQueue65E0D6C7: {
      Type: 'AWS::SQS::Queue',
    },
  },
};

describe('synthApp', () => {
  it('returns object', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new Queue(stack, 'TheQueue');
    const res = synthApp(app);
    expect(res).toEqual(reference);
  });
});

describe('synthAppString', () => {
  it('returns string', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new Queue(stack, 'TheQueue');
    const res = synthAppString(app);
    expect(res).toBe(JSON.stringify(reference, undefined, 2));
  });
});
