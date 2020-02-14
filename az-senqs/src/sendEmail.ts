import AWS from 'aws-sdk';

export const sendEmail = async (
  sender: string,
  receivers: string[],
  subject: string,
  message: string,
  sqsConfig?: AWS.SQS.ClientConfiguration,
) => {
  const params: AWS.SES.SendEmailRequest = {
    Destination: {
      ToAddresses: receivers,
    },
    Message: {
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: message,
        },
      },
    },
    Source: sender,
  };
  const ses = new AWS.SES(sqsConfig);
  await ses.sendEmail(params).promise();
};
