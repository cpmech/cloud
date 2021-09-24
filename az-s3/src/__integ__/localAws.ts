import AWS from 'aws-sdk';
import ip from 'ip';

export const localIp = ip.address();

AWS.config.update({
  region: 'us-east-1',
  s3: {
    endpoint: `http://${localIp}:4566`,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
  },
});
