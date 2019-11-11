const ATMARK = '__AT__';

export const email2username = (email: string): string => {
  return email.replace('@', ATMARK);
};

export const username2email = (username: string): string => {
  return username.replace(ATMARK, '@');
};
