import { sendEmail } from '../sendEmail';

const fakePromise = {
  promise: jest.fn(),
};

jest.mock('aws-sdk', () => ({
  SES: jest.fn(() => ({
    sendEmail: () => fakePromise,
  })),
}));

describe('sendEmail', () => {
  test('works', async () => {
    await sendEmail('me@here.co', ['me@there.co'], 'Hello', 'World');
  });
});
