import cp, { ChildProcess } from 'child_process';

export const onExit = (childProcess: ChildProcess): Promise<void> => {
  return new Promise((resolve, reject) => {
    childProcess.once('exit', (code: number) => {
      if (code === 0) {
        resolve(undefined);
      } else {
        reject(new Error(`Exit with error code = ${code}`));
      }
    });
    childProcess.once('error', (err: Error) => {
      reject(err);
    });
  });
};

export const runCmd = async (
  cmd: string,
  args?: string[],
  showStdErr: boolean = true,
): Promise<any> => {
  const sp = cp.spawn(cmd, args);
  let data: any;
  sp.stdout.on('data', d => {
    data = d;
  });
  if (showStdErr) {
    sp.stderr.on('data', d => {
      console.warn('\n\nERROR:\n' + String(d) + '\n');
    });
  }
  await onExit(sp);
  return data;
};
