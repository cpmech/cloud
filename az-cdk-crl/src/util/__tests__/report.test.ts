import { report } from '../report';

describe('report', () => {
  it('should throw ECONNREFUSED error', async () => {
    const res = report(
      {
        StackId: '123',
        RequestId: '456',
        LogicalResourceId: '789',
        ResponseURL: 'http://localhost',
      },
      { logStreamName: 'log-stream-1' },
      'SUCCESS',
      'physical-id',
      {},
      '',
    );
    try {
      await res;
    } catch (error) {
      expect(error.message).toBe('connect ECONNREFUSED 127.0.0.1:443');
    }
  });
});
