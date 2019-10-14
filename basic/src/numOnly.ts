export const numOnly = (value: string): string => {
  return value.replace(/[\D\s\._\-]+/g, '');
};
