import { listUsers, findUser } from '../adminUsers';
import { ICognitoUser } from '../types';
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
    const users = await listUsers(envars.USER_POOL_ID);
    const res = users.find(u => u.Data.email === EMAIL);
    const user: ICognitoUser = res as ICognitoUser;
    expect(user.Username).toBe(envars.BENDER_USERNAME);
    expect(user.Data.email).toBe(EMAIL);
    expect(user.Data.email_verified).toBe('true');
  });
});

describe('findUser', () => {
  test('works', async () => {
    const user = await findUser(EMAIL, envars.USER_POOL_ID);
    expect(user.Username).toBe(envars.BENDER_USERNAME);
    expect(user.Data.email).toBe(EMAIL);
    expect(user.Data.email_verified).toBe('true');
  });
});
