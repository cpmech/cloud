jest.mock('@cpmech/basic');
import { sleep } from '@cpmech/basic';
import { receiveEmail } from '../receiveEmail';

const ReceiptHandle = 'ekewLJzOqb0jPqQRA==';

const fakePromise = {
  promise: jest.fn(),
};

jest.mock('aws-sdk', () => ({
  SQS: jest.fn(() => ({
    receiveMessage: () => fakePromise,
  })),
}));

const message1 = {
  notificationType: 'Received',
  mail: {
    timestamp: '2019-07-04T08:04:20.622Z',
    source: 'no-reply@testing.com',
    messageId: 'ID',
    destination: ['me@here.co'],
  },
  receipt: {
    timestamp: '2019-07-04T08:04:20.622Z',
    processingTimeMillis: 0,
    recipients: ['me@here.co'],
    spamVerdict: { status: 'PASS' },
    virusVerdict: { status: 'PASS' },
    spfVerdict: { status: 'PASS' },
    dkimVerdict: { status: 'PASS' },
    action: {
      type: 'SNS',
      topicArn: 'theARN',
      encoding: 'UTF8',
    },
  },
  content: 'Hello World',
};

const body1 = {
  Type: 'Notification',
  MessageId: '65c6ac2a-cc44-5777-bc74-f9bd79009a9a',
  TopicArn: 'arn:aws:sns:us-east-1:###:tester-emails',
  Subject: 'Amazon SES Email Receipt Notification',
  Message: JSON.stringify(message1),
  Timestamp: '2019-07-04T08:04:20.632Z',
  SignatureVersion: '1',
  Signature: 'y4B+vEABkiF0Kd5k1BtR1KEg==',
  SigningCertURL: 'nada.pem',
  UnsubscribeURL: 'doitnow',
};

const data1 = [
  {
    MessageId: 'f0689c77-40a3-4795-8c9c-0cc245498cb0',
    ReceiptHandle,
    MD5OfBody: '906725d2e0fc4253bb9e248110db544f',
    Body: JSON.stringify(body1),
  },
];

const message2 = {
  mail: {
    destination: ['inexistent@email.co'],
  },
  content: 'Hello World',
};

const body2 = {
  Message: JSON.stringify(message2),
};

const data2 = [
  {
    ReceiptHandle,
    Body: JSON.stringify(body2),
  },
];

describe('receiveEmail', () => {
  afterEach(() => {
    fakePromise.promise.mockReset();
    (sleep as jest.Mock).mockReset();
  });

  test('works', async () => {
    fakePromise.promise.mockImplementation(() => Promise.resolve({ Messages: data1 }));
    const res = await receiveEmail('me@here.co', 'queue-url', 1);
    expect(res.content).toBe('Hello World');
    expect(res.receiptHandle).toBe(ReceiptHandle);
  });

  test('no Messages', async () => {
    fakePromise.promise.mockImplementation(() => Promise.resolve({}));
    await expect(receiveEmail('me@here.co', 'queue-url', 1)).rejects.toThrowError(
      `cannot find email sent to ${'me@here.co'}`,
    );
  });

  test('no ReceiptHandle and Body', async () => {
    fakePromise.promise.mockImplementation(() => Promise.resolve({ Messages: [{}] }));
    await expect(receiveEmail('me@here.co', 'queue-url', 1)).rejects.toThrowError(
      `cannot find email sent to ${'me@here.co'}`,
    );
  });

  test('no Body.Message', async () => {
    fakePromise.promise.mockImplementation(() =>
      Promise.resolve({ Messages: [{ ReceiptHandle, Body: '{}' }] }),
    );
    await expect(receiveEmail('me@here.co', 'queue-url', 1)).rejects.toThrowError(
      `cannot find email sent to ${'me@here.co'}`,
    );
  });

  test('no Body.Message.mail', async () => {
    fakePromise.promise.mockImplementation(() =>
      Promise.resolve({
        Messages: [{ ReceiptHandle, Body: JSON.stringify({ Message: '{}' }) }],
      }),
    );
    await expect(receiveEmail('me@here.co', 'queue-url', 1)).rejects.toThrowError(
      `cannot find email sent to ${'me@here.co'}`,
    );
  });

  test('try 2 times', async () => {
    let trial = 0;
    fakePromise.promise.mockImplementation(() => {
      if (trial > 0) {
        trial++;
        return Promise.resolve({ Messages: data2 });
      } else {
        trial++;
        return Promise.resolve({ Messages: data1 });
      }
    });
    try {
      await receiveEmail('inexistent@email.co', 'queue-url', 6);
    } catch (_) {
      /* ok*/
    }
    expect(fakePromise.promise).toBeCalledTimes(2);
    expect(sleep).toBeCalledTimes(1);
  });

  test('skip sleep if next try is the last one', async () => {
    fakePromise.promise.mockImplementation(() => Promise.resolve({ Messages: data1 }));
    try {
      await receiveEmail('inexistent@here.co', 'queue-url', 4);
    } catch (_) {
      /* ok*/
    }
    expect(sleep).toBeCalledTimes(3);
  });
});
