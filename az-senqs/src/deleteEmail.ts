import AWS from 'aws-sdk';

// deleteEmail deletes email
export const deleteEmail = async (
  receiptHandle: string,
  queueUrl: string,
  region: string = 'us-east-1',
) => {
  const sqs = new AWS.SQS({ region });
  await sqs
    .deleteMessage({
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle,
    })
    .promise();
};
