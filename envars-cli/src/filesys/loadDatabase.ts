import fs from 'fs';
import { Iany } from '../types';

// loadDatabase reads the envars.json file
export const loadDatabase = (envarsJsonPath: string): Iany => {
  const output = fs.readFileSync(envarsJsonPath, { encoding: 'UTF-8' });
  return JSON.parse(output) as Iany;
};
