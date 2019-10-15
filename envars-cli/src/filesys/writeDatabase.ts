import fs from 'fs';
import { Iany } from '../types';

// writeDatabase writes the envars.json file
export const writeDatabase = (envarsJsonPath: string, db: Iany) => {
  const out = JSON.stringify(db, undefined, 2) + '\n';
  fs.writeFileSync(envarsJsonPath, out, { encoding: 'UTF-8' });
};
