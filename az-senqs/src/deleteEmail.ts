import AWS from 'aws-sdk';

// deleteEmail deletes email
export const deleteEmail = async (
  receiptHandle: string,
  queueUrl: string,
  sqsConfig?: AWS.SQS.ClientConfiguration,
) => {
  const sqs = new AWS.SQS(sqsConfig);
  await sqs
    .deleteMessage({
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle,
    })
    .promise();
};
