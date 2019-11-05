import { S3 } from 'aws-sdk';

export const getDownloadUrl = (
  bucket: string,
  filekey: string,
  region: string = 'us-east-1',
): string => {
  const s3 = new S3({ region });
  return s3.getSignedUrl('getObject', {
    Bucket: bucket,
    Key: filekey,
  });
};
