import { Context } from 'aws-lambda';

export const zeroContext: Context = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: '',
  functionVersion: '',
  invokedFunctionArn: '',
  memoryLimitInMB: 0,
  awsRequestId: '',
  logGroupName: '',
  logStreamName: '',
  getRemainingTimeInMillis: () => 0,
  done: () => {
    /* empty */
  },
  fail: (error: string) => {
    /* empty*/
  },
  succeed: (messageOrObject: any) => {
    /* empty */
  },
};
