import fs from 'fs';
import { hasProp } from '@cpmech/basic';
import { loadDatabase } from './filesys/loadDatabase';
import { writeDatabase } from './filesys/writeDatabase';
import { Iany } from './types';

// updateEnvars updates data in the envars.json file of a particular project
// This function also creates all data structure for a new project
export const updateEnvars = (
  envars: Iany,
  envarsJsonPath: string,
  project: string,
  stage: string = 'dev',
  keysToDelete?: string[],
) => {
  if (!fs.existsSync(envarsJsonPath)) {
    fs.writeFileSync(envarsJsonPath, '{}', { encoding: 'UTF-8' });
  }
  const db = loadDatabase(envarsJsonPath);
  if (!hasProp(db, project)) {
    db[project] = {};
  }
  const projData = db[project];
  if (!hasProp(projData, stage)) {
    projData[stage] = {};
  }
  const data = projData[stage];
  Object.keys(envars).forEach(key => {
    data[key] = envars[key];
  });
  if (keysToDelete) {
    keysToDelete.forEach(key => {
      delete data[key];
    });
  }
  writeDatabase(envarsJsonPath, db);
};
