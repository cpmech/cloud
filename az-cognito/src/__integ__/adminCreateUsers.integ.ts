import { v4 } from 'uuid';
import {
  adminCreateUsers,
  adminListUserGroups,
  adminDeleteUser,
  adminGetAttributes,
} from '../admin';
import { initEnvars } from '@cpmech/envars';

jest.setTimeout(20000);

const envars = {
  CLOUD_COGNITO_POOLID: '',
  CLOUD_COGNITO_CLIENTID: '',
  CLOUD_RECV_DOMAIN: '',
  CLOUD_RECV_QUEUE_URL: '',
  CLOUD_BENDER_USERNAME: '',
};

initEnvars(envars);

let username0 = '';
let username1 = '';

afterEach(async () => {
  if (username0) {
    await adminDeleteUser(envars.CLOUD_COGNITO_POOLID, username0);
  }
  if (username1) {
    await adminDeleteUser(envars.CLOUD_COGNITO_POOLID, username1);
  }
});

describe('adminCreateUsers', () => {
  it('should create two users', async () => {
    // create
    const usernames = await adminCreateUsers(
      envars.CLOUD_COGNITO_POOLID,
      envars.CLOUD_COGNITO_CLIENTID,
      [
        {
          email: `tester+${v4()}@${envars.CLOUD_RECV_DOMAIN}`,
          password: '123paSSword$',
          groups: 'testers',
        },
        {
          email: `tester+${v4()}@${envars.CLOUD_RECV_DOMAIN}`,
          password: '456paSSword$',
          groups: 'visitors,travellers',
        },
      ],
      undefined,
      true,
    );
    expect(usernames.length).toBe(2);
    username0 = usernames[0];
    username1 = usernames[1];

    // check email verified
    const attrs0 = await adminGetAttributes(envars.CLOUD_COGNITO_POOLID, username0);
    const attrs1 = await adminGetAttributes(envars.CLOUD_COGNITO_POOLID, username1);
    expect(attrs0.email_verified).toBe('true');
    expect(attrs1.email_verified).toBe('true');

    // check groups
    const groups0 = await adminListUserGroups(envars.CLOUD_COGNITO_POOLID, username0);
    const groups1 = await adminListUserGroups(envars.CLOUD_COGNITO_POOLID, username1);
    expect(groups0.some((g) => ['testers'].includes(g))).toBeTruthy();
    expect(groups1.some((g) => ['travellers', 'visitors'].includes(g))).toBeTruthy();
  });
});
