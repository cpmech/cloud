import AWS from 'aws-sdk';
import { adminFindUserByEmail, adminAddUserToGroup, adminListUserGroups } from '../admin';
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

AWS.config.update({
  region: 'us-east-1',
});

let emailBender = `tester+bender@${envars.CLOUD_RECV_DOMAIN}`;

describe('addUserToGroup', () => {
  it('should add bender to travellers group', async () => {
    // get user
    const user = await adminFindUserByEmail(envars.CLOUD_COGNITO_POOLID, emailBender);
    expect(user.Username).toBe(envars.CLOUD_BENDER_USERNAME);
    if (!user.Username) {
      fail('cannot get Bender username');
    }

    // add user to group
    await adminAddUserToGroup(envars.CLOUD_COGNITO_POOLID, user.Username, 'travellers', true);

    // check
    const groups = await adminListUserGroups(envars.CLOUD_COGNITO_POOLID, user.Username);
    expect(groups.includes('travellers')).toBeTruthy();
  });
});
