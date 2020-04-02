import { simpleParser } from 'mailparser';

const extractCode = (message: string, notices: string[], codeLen: number): string => {
  const msg = message.trim();
  for (const notice of notices) {
    const rex = new RegExp(notice, 'im');
    const dat = rex.exec(msg);
    if (dat) {
      const l = notice.length;
      const i = dat.index;
      const r = msg.substring(i + l + 1, i + l + codeLen + 1).trim();
      return r;
    }
  }
  throw new Error('cannot extract code from email content');
};

// extractCodeFromEmail extracts code from email content (body)
export const extractCodeFromEmail = async (
  emailContent: string,
  notices: string[] = [
    'Your confirmation code is',
    'Your verification code is',
    'Your code is',
    'The confirmation code is',
    'The verification code is',
    'The code is',
  ],
  codeLen: number = 6,
) => {
  const res = await simpleParser(emailContent);
  let message = '';
  if (res.text) {
    message = res.text;
  }
  if (res.html) {
    message = String(res.html);
  }
  if (!message) {
    throw new Error('cannot extract message from email');
  }
  return extractCode(message, notices, codeLen);
};

export const extractSubjectAndMessage = async (
  emailContent: string,
): Promise<{ subject: string; message: string }> => {
  const res = await simpleParser(emailContent);
  let message = '';
  if (res.text) {
    message = res.text;
  }
  if (res.html) {
    message = String(res.html);
  }
  return {
    subject: res.subject || '',
    message,
  };
};
