import { hasProp } from '@cpmech/basic';
import { report } from './util/report';
import { any2type } from '@cpmech/js2ts';
import { addUserToGroup } from '@cpmech/az-cognito';

const createUsers = async (UserPoolId: string, users: IUserInput) => {};

// cognitoAddUsers adds users to Cognito pool
//
// INPUT:
//
//   event.ResourceProperties {
//     UserPoolId: string;
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
    if (!hasProp(event.ResourceProperties, 'Users')) {
      throw new Error(`ResourceProperties must have Users prop`);
    }

    // extract input
    const { UserPoolId, Users } = event.ResourceProperties;
    const users = any2type(refUserInput, Users);

    // check input again
    if (!users) {
      throw new Error(`cannot extract users data. Users = ${JSON.stringify(Users)}`);
    }

    // set the physical resource Id
    let resourceId = UserPoolId;

    // handle request
    switch (event.RequestType) {
      case 'Create':
        console.log('..... creating users ......');
        await createUsers(UserPoolId, users);
        break;

      case 'Update':
        console.log('..... updating users ......');
        await updateUsers(UserPoolId, users);
        break;

      case 'Delete':
        console.log('..... deleting users ......');
        await deleteUsers(UserPoolId, users);
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
