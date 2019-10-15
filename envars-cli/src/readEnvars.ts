import { hasProp } from '@cpmech/basic';
import { loadDatabase } from './filesys/loadDatabase';
import { Iany } from './types';

// readEnvars reads envars.json file and extracts data from project/stage
export const readEnvars = (
  envarsJsonPath: string,
  project: string,
  stage: string = 'dev',
): Iany => {
  const db = loadDatabase(envarsJsonPath);
  if (hasProp(db, project)) {
    const projData = db[project];
    if (hasProp(projData, stage)) {
      const data = projData[stage];
      return data;
    } else {
      throw new Error(
        `${envarsJsonPath} does not have variables for stage = "${stage}" of project = "${project}"`,
      );
    }
  } else {
    throw new Error(`${envarsJsonPath} does not have project = "${project}"`);
  }
};
