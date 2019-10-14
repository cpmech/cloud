import AWS from 'aws-sdk';
import { sleep } from '@cpmech/basic'; // /dist/esm/pure';
import { IQueueEmail } from './types';

// receiveEmail returns email content from SQS message
export const receiveEmail = async (
  destination: string,
  queueUrl: string,
  region: string = 'us-east-1',
  numberOfTrials: number = 5,
  delayMS: number = 3000,
): Promise<IQueueEmail> => {
  const sqs = new AWS.SQS({ region });
  for (let i = 0; i < numberOfTrials; i++) {
    const res = await sqs
      .receiveMessage({
        MaxNumberOfMessages: 10,
        QueueUrl: queueUrl,
        WaitTimeSeconds: 10,
        VisibilityTimeout: 30,
      })
      .promise();
    if (res.Messages && res.Messages.length > 0) {
      for (const notification of res.Messages) {
        if (notification.ReceiptHandle && notification.Body) {
          const body = JSON.parse(notification.Body);
          if (body.Message) {
            const message = JSON.parse(body.Message);
            const { mail } = message;
            if (
              mail &&
              mail.destination &&
              mail.destination.length === 1 &&
              mail.destination[0] === destination
            ) {
              return {
                receiptHandle: notification.ReceiptHandle,
                content: message.content,
              };
            }
          }
        }
      }
    }
    if (i + 1 < numberOfTrials) {
      await sleep(delayMS);
    }
  }
  throw new Error(`cannot find email sent to ${destination}`);
};
