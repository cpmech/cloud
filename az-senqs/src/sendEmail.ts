import AWS from 'aws-sdk';
import nodemailer from 'nodemailer';
import { Attachment } from 'nodemailer/lib/mailer';

export const sendEmail = async (
  sender: string,
  receivers: string[],
  subject: string,
  message: string,
  attachments?: Attachment[],
  sqsConfig?: AWS.SQS.ClientConfiguration,
) => {

  const transporter = nodemailer.createTransport({
    SES: new AWS.SES(sqsConfig)
  });

  return await transporter.sendMail(
    {
      from: sender,
      to: receivers,
      subject,
      text: message,
      attachments: attachments!,
    }
  );
};
