import AWS from 'aws-sdk';
import { findUser } from '../adminUsers';
import { addUserToGroup } from '../addUserToGroup';
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

describe('addUserToGroup', () => {
  it('should add bender to travellers group', async () => {
    // get user
    const user = await findUser(EMAIL, envars.USER_POOL_ID);
    expect(user.Username).toBe(envars.BENDER_USERNAME);
    if (!user.Username) {
      fail('cannot get Username');
    }

    // add user to group
    await addUserToGroup(envars.USER_POOL_ID, user.Username, 'travellers', true);
    const cognito = new AWS.CognitoIdentityServiceProvider({ region: 'us-east-1' });

    // check
    const res = await cognito
      .adminListGroupsForUser({
        UserPoolId: envars.USER_POOL_ID,
        Username: user.Username,
      })
      .promise();
    if (!res.Groups) {
      fail('cannot get groups');
    }
    const groupData = res.Groups.find(g => g.GroupName === 'travellers');
    if (!groupData) {
      fail('cannot get group data');
    }
    expect(groupData.GroupName).toBe('travellers');
  });
});
