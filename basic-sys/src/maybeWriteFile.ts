import fsextra from 'fs-extra';

// maybeWriteFile generates a new file or overwrite an existent one
export const maybeWriteFile = (overwrite: boolean, filepath: string, generator: () => string) => {
  if (overwrite) {
    fsextra.outputFileSync(filepath, generator());
    return;
  }
  if (!fsextra.pathExistsSync(filepath)) {
    fsextra.outputFileSync(filepath, generator());
    return;
  }
  throw new Error(`file <${filepath}> exists`);
};
