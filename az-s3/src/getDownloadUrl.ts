import { S3 } from 'aws-sdk';

// NOTE: the given filekey should have a FileExt
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
