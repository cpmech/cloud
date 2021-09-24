import { S3 } from 'aws-sdk';

// NOTE: the path must have a FileExt
export const getDownloadUrl = (
  bucket: string,
  path: string,
  expireSeconds?: number,
  s3Config?: S3.ClientConfiguration,
): string => {
  const s3 = new S3(s3Config);
  return s3.getSignedUrl('getObject', {
    Bucket: bucket,
    Key: path,
    Expires: expireSeconds,
  });
};
