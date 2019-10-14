jest.mock('@cpmech/basic');
import { deleteEmail } from '../deleteEmail';

const ReceiptHandle = 'ekewLJzOqb0jPqQRA==';

const fakePromise = {
  promise: jest.fn(),
};

jest.mock('aws-sdk', () => ({
  SQS: jest.fn(() => ({
    deleteMessage: () => fakePromise,
  })),
}));

describe('deleteEmail', () => {
  test('works', async () => {
    await deleteEmail(ReceiptHandle, 'queue-url');
  });
});
