import { extractCodeFromEmail, extractSubjectAndMessage } from '../parseEmail';

// tslint:disable-next-line: max-line-length
const content1 = `Return-Path: <11111111111111111111111111111111111111111111111@amazonses.com>
Received: from 11-11.smtp-out.amazonses.com (11-11.smtp-out.amazonses.com [11.111.1.11])
 by inbound-smtp.us-east-1.amazonaws.com with SMTP id 11111111111111111111111111111111111111
 for tester+111111111111111111111111111111111111@222222.com;
 Sun, 07 Jul 2019 22:19:15 +0000 (UTC)
Received-SPF: pass (spfCheck: domain of amazonses.com designates 11.111.1.11 as permitted sender) client-ip=11.111.1.11; envelope-from=1111111111111111111@amazonses.com; helo=11-11-smtp-out.amazonses.com;
Authentication-Results: amazonses.com;
 spf=pass (spfCheck: domain of amazonses.com designates 11.111.1.11 as permitted sender) client-ip=11.111.1.11; envelope-from=1111111111111111111111111@amazonses.com; helo=11-11.smtp-out.amazonses.com;
 dkim=pass header.i=@amazonses.com;
 dmarc=none header.from=222222.com;
X-SES-RECEIPT: 1111111111111111111111111111111111111111111111111
X-SES-DKIM-SIGNATURE: a=rsa-sha256; q=dns/txt; b=11111; c=relaxed/simple; s=111111111111111111; d=amazonses.com; t=11111111111; v=1; bh=1111111111111; h=From:To:Cc:Bcc:Subject:Date:Message-ID:MIME-Version:Content-Type:X-SES-RECEIPT;
DKIM-Signature: v=1; a=rsa-sha256; q=dns/txt; c=relaxed/simple;
	s=111111111111111111; d=amazonses.com; t=1111111111111111;
	h=From:To:Message-ID:Subject:MIME-Version:Content-Type:Date:Feedback-ID;
	bh=1111111111111111111111111;
	b=1111111111111111111111111111111111111
	1111111111111111111111111111111111111111111111111111111111111111111
	11111111111111111111111111111111111111111
From: tester@222222.com
To: tester+111111111111111111111111111111111111@222222.com
Message-ID: <111111111111111111111111111111111111111111111111111111111111@email.amazonses.com>
Subject: Your verification code
MIME-Version: 1.0
Content-Type: multipart/mixed; 
	boundary="----=_Part_11111_22222222.3333333333333"
user_pool_name: 111111111
region: us-east-1
Date: Sun, 7 Jul 2019 22:19:14 +0000
X-SES-Outgoing: 2019.07.07-11.111.1.11
Feedback-ID: 1.us-east-1.11111111111111111/22222222222222222222222222:AmazonSES

------=_Part_11111_22222222.3333333333333
Content-Type: text/html; charset=UTF-8
Content-Transfer-Encoding: 7bit

Your confirmation code is 654321
------=_Part_11111_22222222.3333333333333--

`;

const content2 = `From: 111111@c22222.com
To: 33333@44444.com
Subject: CODE
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8
Content-Transfer-Encoding: 7bit
Message-ID: <1111111111111111@email.amazonses.com>
Date: Mon, 8 Jul 2019 05:22:47 +0000
X-SES-Outgoing: 2019.07.08-54.240.8.23
Feedback-ID: 1.us-east-1.11111111111

Key = 123-456

`;

describe('extractCodeFromEmail', () => {
  test('works (simple content)', async () => {
    const res = await extractCodeFromEmail(
      'From: tester@test.co\n\nYour verification code is 123456',
    );
    expect(res).toBe('123456');
  });

  test('works (whole email content)', async () => {
    const res = await extractCodeFromEmail(content1);
    expect(res).toBe('654321');
  });

  test('fails (wrong email format)', async () => {
    await expect(extractCodeFromEmail('From: nada')).rejects.toThrow(
      'cannot extract message from email',
    );
  });

  test('fails (wrong notice with code)', async () => {
    await expect(
      extractCodeFromEmail('From: tester@test.co\n\nYour data code is 666666'),
    ).rejects.toThrow('cannot extract code from email content');
  });

  test('works (simple email)', async () => {
    const res = await extractCodeFromEmail(content2, ['Key ='], 7);
    expect(res).toBe('123-456');
  });
});

describe('extractSubjectAndMessage', () => {
  it('should return subject and message', async () => {
    const res = await extractSubjectAndMessage(content1);
    expect(res).toEqual({
      subject: 'Your verification code',
      message: 'Your confirmation code is 654321',
    });
  });
});
