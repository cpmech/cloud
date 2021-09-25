import AWS from 'aws-sdk';
import { adminFindUserByEmail, adminAddUserToGroup } from '../admin';
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
    const cognito = new AWS.CognitoIdentityServiceProvider({ region: 'us-east-1' });
    const res = await cognito
      .adminListGroupsForUser({
        UserPoolId: envars.CLOUD_COGNITO_POOLID,
        Username: user.Username,
      })
      .promise();
    if (!res.Groups) {
      fail('cannot get groups');
    }
    const groupData = res.Groups.find((g) => g.GroupName === 'travellers');
    if (!groupData) {
      fail('cannot get group data');
    }
    expect(groupData.GroupName).toBe('travellers');
  });
});
