// Used for test purposes only
export let defaultResponseURL: string;

// Upload a CloudFormation response object to S3.
// INPUT:
//   event -- the Lambda event payload received by the handler function
//   context -- the Lambda context received by the handler function
//   responseStatus -- the response status, either 'SUCCESS' or 'FAILED'
//   physicalResourceId -- CloudFormation physical resource ID
//   responseData -- arbitrary response data object
//   reason -- reason for failure, if any, to convey to the user
// OUTPUT:
//   Promise that is resolved on success, or rejected on connection error or HTTP error response
export const report = (
  event: any,
  context: any,
  responseStatus: string,
  physicalResourceId: string,
  responseData?: any,
  reason?: string,
) => {
  return new Promise((resolve, reject) => {
    const https = require('https');
    const { URL } = require('url');

    const responseBody = JSON.stringify({
      Status: responseStatus,
      Reason: reason,
      PhysicalResourceId: physicalResourceId || context.logStreamName,
      StackId: event.StackId,
      RequestId: event.RequestId,
      LogicalResourceId: event.LogicalResourceId,
      Data: responseData,
    });

    const parsedUrl = new URL(event.ResponseURL || defaultResponseURL);
    const options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'PUT',
      headers: {
        'Content-Type': '',
        'Content-Length': responseBody.length,
      },
    };

    https
      .request(options)
      .on('error', reject)
      .on('response', (res: any) => {
        res.resume();
        if (res.statusCode >= 400) {
          reject(new Error(`Server returned error ${res.statusCode}: ${res.statusMessage}`));
        } else {
          resolve();
        }
      })
      .end(responseBody, 'utf8');
  });
};
