let MLOG_VERBOSE = true;
let ELOG_VERBOSE = true;

// setMlog sets message logging verbose mode
export const setMlog = (verbose: boolean) => (MLOG_VERBOSE = verbose);

// setElog sets error message logging verbose mode
export const setElog = (verbose: boolean) => (ELOG_VERBOSE = verbose);

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
  let msg = '[ERROR] ';
  if (error.message) {
    msg += error.message;
  } else {
    msg += JSON.stringify(error, undefined, 2);
  }
  if (ELOG_VERBOSE) {
    console.log(msg);
  }
  return msg;
};
