const ATMARK = '__AT__';

export const makeUsername = (email: string): string => {
  return email.replace('@', ATMARK);
};

export const makeEmail = (username: string): string => {
  return username.replace(ATMARK, '@');
};
