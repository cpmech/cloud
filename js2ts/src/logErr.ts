// logErr logs the error in any2type
export const logErr = (obj: any, key: string = '') => {
  if (!obj) {
    console.log('[ERROR] object is null');
    return;
  }
  console.log(`[ERROR] object = ${JSON.stringify(obj)}`);
  console.log(`[ERROR] property for key = ${key} doesn't exist or has incorrect type`);
};
