// email2key converts email address to key by removing the @ mark and dots
export const email2key = (email: string): string => {
  return email.toLowerCase().replace(/[@\.]/g, '_');
};
