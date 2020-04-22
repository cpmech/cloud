import AWS from 'aws-sdk';
import { ICognitoUser } from './types';
import { flattenAttributes } from '../helpers';
import { sleep } from '@cpmech/basic';

const DELAY = 200;

export const adminListUsers = async (
  poolId: string,
  attributesToGet?: string[],
  region: string = 'us-east-1',
): Promise<ICognitoUser[]> => {
  const cognito = new AWS.CognitoIdentityServiceProvider({ region });

  let list: AWS.CognitoIdentityServiceProvider.UsersListType = [];
  let paginationToken = '';

  do {
    const res = await cognito
      .listUsers({
        UserPoolId: poolId,
        AttributesToGet: attributesToGet,
        PaginationToken: paginationToken || undefined,
      })
      .promise();

    if (res.Users && res.Users.length > 0) {
      list = list.concat(res.Users);
    }

    if (res.PaginationToken) {
      paginationToken = res.PaginationToken;
      await sleep(DELAY);
    } else {
      paginationToken = '';
    }
  } while (paginationToken);

  if (list.length === 0) {
    return [];
  }

  return list.map((u) => flattenAttributes(u));
};
