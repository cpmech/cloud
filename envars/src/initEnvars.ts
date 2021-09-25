import { hasProp } from '@cpmech/basic';
import { IEnvars } from './types';

// initEnvars initializes envars with the values from process.env
// NOTE: existent process.env variables will be overwritten
export const initEnvars = (envars: IEnvars, allowEmptyVar: boolean = false) => {
  Object.keys(envars).forEach((key) => {
    if (!hasProp(process.env, key)) {
      throw new Error(`cannot find environment variable named "${key}"`);
    }
    const value = process.env[key] as string;
    if (!allowEmptyVar && !value) {
      throw new Error(`environment variable "${key}" must not be empty`);
    }
    envars[key] = value;
  });
};
