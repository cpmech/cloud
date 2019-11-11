import { ICognitoUser, ICognitoUserType } from '../admin/types';

export const flattenAttributes = (user: ICognitoUserType): ICognitoUser => {
  let Data = {};
  if (user.Attributes) {
    Data = user.Attributes.reduce((acc, curr) => ({ ...acc, [curr.Name]: curr.Value }), {});
  }
  const res = {
    ...user,
    Data,
  };
  delete res.Attributes;
  return res;
};
