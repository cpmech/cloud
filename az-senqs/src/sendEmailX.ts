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
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
  inReplyTo?: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: IEmailAttachment[];
  sqsConfig?: AWS.SQS.ClientConfiguration;
}

export const sendEmailX = async ({
  sender,
  receivers,
  cc,
  bcc,
  replyTo,
  inReplyTo,
  subject,
  text,
  html,
  attachments,
  sqsConfig,
}: ISendEmailX) => {
  const transporter = nodemailer.createTransport({
    SES: new AWS.SES(sqsConfig),
  });

  const formattedAttachments = attachments?.map(
    (a: IEmailAttachment): Attachment => ({ filename: a.filename, path: a.path }),
  );

  return await transporter.sendMail({
    from: sender,
    to: receivers,
    cc,
    bcc,
    replyTo,
    inReplyTo,
    subject,
    text,
    html,
    attachments: formattedAttachments,
  });
};
