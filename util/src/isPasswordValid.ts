// tslint:disable-next-line: max-line-length
// To check a password between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character
// ref: https://www.w3resource.com/javascript/form/password-validation.php
const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

export const isPasswordValid = (pwd: string): boolean => re.test(pwd);
