import { adminListUsers, adminFindUserByEmail, ICognitoUser } from '../admin';
import { initEnvars } from '@cpmech/envars';

const envars = {
  USER_POOL_ID: '',
  USER_POOL_CLIENT_ID: '',
  BENDER_USERNAME: '',
  QUEUE_URL: '',
};

initEnvars(envars);

jest.setTimeout(20000);

const EMAIL = 'bender.rodriguez@futurama.space';

describe('listUsers', () => {
  test('works', async () => {
    const users = await adminListUsers(envars.USER_POOL_ID);
    const res = users.find(u => u.Data.email === EMAIL);
    const user: ICognitoUser = res as ICognitoUser;
    expect(user.Username).toBe(envars.BENDER_USERNAME);
    expect(user.Data.email).toBe(EMAIL);
    expect(user.Data.email_verified).toBe('true');
  });
});

describe('findUser', () => {
  test('works', async () => {
    const user = await adminFindUserByEmail(envars.USER_POOL_ID, EMAIL);
    expect(user.Username).toBe(envars.BENDER_USERNAME);
    expect(user.Data.email).toBe(EMAIL);
    expect(user.Data.email_verified).toBe('true');
  });
});
