import { hasProp } from '@cpmech/basic';
import { report } from './util/report';
import {
  adminCreateUsers,
  adminDeleteUser,
  IUserInput,
  adminFindUserByEmail,
} from '@cpmech/az-cognito';

const createUsers = async (poolId: string, clientId: string, users: IUserInput[]) => {
  await adminCreateUsers(poolId, clientId, users);
};

const deleteUsers = async (poolId: string, users: IUserInput[]) => {
  for (const user of users) {
    const u = await adminFindUserByEmail(poolId, user.email);
    if (u.Username) {
      await adminDeleteUser(poolId, u.Username);
    }
  }
};

// cognitoAddUsers adds users to Cognito pool
//
// INPUT:
//
//   export interface IUserInput {
//     email: string;
//     password: string;
//     groups: string; // comma-separated
//   }
//
//   event.ResourceProperties {
//     UserPoolId: string;
//     UserPoolClientId: string;
//     Users: IUserInput[];
//   }
//
// OUTPUT:
//   The PhysicalResourceId will be equal to the UserPoolId
//
export const cognitoAddUsers = async (event: any, context: any) => {
  try {
    // check input
    if (!hasProp(event.ResourceProperties, 'UserPoolId')) {
      throw new Error(`ResourceProperties must have UserPoolId prop`);
    }
    if (!hasProp(event.ResourceProperties, 'UserPoolClientId')) {
      throw new Error(`ResourceProperties must have UserPoolClientId prop`);
    }
    if (!hasProp(event.ResourceProperties, 'Users')) {
      throw new Error(`ResourceProperties must have Users prop`);
    }

    // extract input
    const { UserPoolId, UserPoolClientId, Users } = event.ResourceProperties;

    // set the physical resource Id
    let resourceId = UserPoolId;

    // handle request
    switch (event.RequestType) {
      case 'Create':
        console.log('..... creating users ......');
        await createUsers(UserPoolId, UserPoolClientId, Users);
        break;

      case 'Update':
        console.log('..... updating users ......');
        await createUsers(UserPoolId, UserPoolClientId, Users);
        break;

      case 'Delete':
        console.log('..... deleting users ......');
        await deleteUsers(UserPoolId, Users);
        resourceId = event.PhysicalResourceId;
        break;

      default:
        throw new Error(`unsupported request type ${event.RequestType}`);
    }

    // return SUCCESS message
    const responseData = {};
    await report(event, context, 'SUCCESS', resourceId, responseData);
    //
    // handle errors
  } catch (err) {
    await report(event, context, 'FAILED', '', null, err.message);
  }
};
