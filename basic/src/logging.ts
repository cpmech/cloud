let MLOG_VERBOSE = true;
let ELOG_VERBOSE = true;
let ELOG_PREFIX = '[ERROR]';

// setMlog sets message logging verbose mode
export const setMlog = (verbose: boolean) => (MLOG_VERBOSE = verbose);

// setElog sets error message logging verbose mode
export const setElog = (verbose: boolean) => (ELOG_VERBOSE = verbose);

// setElogPrefix sets error log prefix
export const setElogPrefix = (prefix: string) => (ELOG_PREFIX = prefix);

// mlog logs message, if verbose mode is on
export const mlog = (message: any) => {
  if (MLOG_VERBOSE) {
    if (
      typeof message === 'string' ||
      typeof message === 'number' ||
      typeof message === 'boolean'
    ) {
      console.log(message);
    }
    console.log(JSON.stringify(message, undefined, 2));
  }
};

// elog logs error, if vermobse mode is on, and returns the formatted error message
export const elog = (error: any): string => {
  let msg = '';
  if (error.message && typeof error.message === 'string') {
    error.message.replace(`${ELOG_PREFIX} `, '');
    msg = `${ELOG_PREFIX} ${error.message}`;
  } else {
    if (typeof error === 'string' || typeof error === 'number' || typeof error === 'boolean') {
      msg = `${ELOG_PREFIX} ${error}`;
    } else {
      msg = `${ELOG_PREFIX}\n${JSON.stringify(error, undefined, 2)}`;
    }
  }
  msg = msg.replace(`${ELOG_PREFIX} ${ELOG_PREFIX}`, ELOG_PREFIX);
  if (ELOG_VERBOSE) {
    console.log(msg);
  }
  return msg;
};
