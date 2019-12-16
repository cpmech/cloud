import { v4 } from 'uuid';
import {
  adminCreateUsers,
  adminListUserGroups,
  adminDeleteUser,
  adminGetAttributes,
} from '../admin';
import { initEnvars } from '@cpmech/envars';

const envars = {
  USER_POOL_ID: '',
  USER_POOL_CLIENT_ID: '',
  BENDER_USERNAME: '',
  QUEUE_URL: '',
};

initEnvars(envars);

jest.setTimeout(20000);

let username0 = '';
let username1 = '';

afterEach(async () => {
  if (username0) {
    await adminDeleteUser(envars.USER_POOL_ID, username0);
  }
  if (username1) {
    await adminDeleteUser(envars.USER_POOL_ID, username1);
  }
});

describe('adminCreateUsers', () => {
  it('should create two users', async () => {
    // create
    const usernames = await adminCreateUsers(
      envars.USER_POOL_ID,
      envars.USER_POOL_CLIENT_ID,
      [
        {
          email: `tester+${v4()}@azcdk.xyz`,
          password: '123paSSword$',
          groups: 'testers',
        },
        {
          email: `tester+${v4()}@azcdk.xyz`,
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
    const attrs0 = await adminGetAttributes(envars.USER_POOL_ID, username0);
    const attrs1 = await adminGetAttributes(envars.USER_POOL_ID, username1);
    expect(attrs0.email_verified).toBe('true');
    expect(attrs1.email_verified).toBe('true');

    // check groups
    const groups0 = await adminListUserGroups(envars.USER_POOL_ID, username0);
    const groups1 = await adminListUserGroups(envars.USER_POOL_ID, username1);
    expect(groups0).toEqual(['testers']);
    expect(groups1).toEqual(['travellers', 'visitors']);
  });
});
