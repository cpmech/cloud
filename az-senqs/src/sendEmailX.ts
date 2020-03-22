import AWS from 'aws-sdk';
import nodemailer from 'nodemailer';
import { Attachment } from 'nodemailer/lib/mailer';

export interface IEmailAttachment {
  filename: string;
  path: string;
}

export interface ISendEmailX {
  sender: string;
  receivers: string[];
  subject: string;
  message: string;
  attachments?: IEmailAttachment[];
  sqsConfig?: AWS.SQS.ClientConfiguration;
}

export const sendEmailX = async (mail: ISendEmailX) => {
  const { sender, receivers, subject, message, attachments } = mail;
  const transporter = nodemailer.createTransport({
    SES: new AWS.SES(mail.sqsConfig),
  });

  const formattedAttachments = attachments?.map(
    (a: IEmailAttachment): Attachment => ({ filename: a.filename, path: a.path }),
  );

  return await transporter.sendMail({
    from: sender,
    to: receivers,
    subject,
    text: message,
    attachments: formattedAttachments,
  });
};
