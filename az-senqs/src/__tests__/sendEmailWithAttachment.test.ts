import { sendEmailWithAttachment } from '../sendEmailWithAttachment';
import * as Mail from 'nodemailer/lib/mailer';

const fakeSend = jest.fn((mail: Mail.Options) => mail);


jest.mock('nodemailer', () => ({
  createTransport: () => ({
      sendMail: fakeSend,
  })
}));

describe('sendEmailWithAttachment', () => {
  test('works', async () => {
    await sendEmailWithAttachment({
        sender: 'me@here.co',
        receivers: ['me@there.co'],
        message: 'Hello',
      subject: 'World',
      attachments: [{filename: 'react-image.png', path: 'https://blog.rocketseat.com.br/content/images/2019/03/React-Hooks-Comoutilizar--motivac-o-es-eexemplos-pra-ticos.png'}]});
  });

  test('format params correctly', async () => {
    const sentMail = await sendEmailWithAttachment({
      sender: 'me@here.co',
      receivers: ['me@there.co'],
      message: 'Hello',
      subject: 'World',
      attachments: [{filename: 'react-image.png', path: 'https://blog.rocketseat.com.br/content/images/2019/03/React-Hooks-Comoutilizar--motivac-o-es-eexemplos-pra-ticos.png'}]
    });

    expect(sentMail).toEqual({
      from: 'me@here.co',
      to: ['me@there.co'],
      subject: 'World',
      text: 'Hello',
      attachments: [{filename: 'react-image.png', path: 'https://blog.rocketseat.com.br/content/images/2019/03/React-Hooks-Comoutilizar--motivac-o-es-eexemplos-pra-ticos.png'}],
    });
  });
});