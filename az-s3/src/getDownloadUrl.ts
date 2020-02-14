import { S3 } from 'aws-sdk';

// NOTE: the given filekey should have a FileExt
export const getDownloadUrl = (
  bucket: string,
  filekey: string,
  s3Config?: S3.ClientConfiguration,
): string => {
  const s3 = new S3(s3Config);
  return s3.getSignedUrl('getObject', {
    Bucket: bucket,
    Key: filekey,
  });
};
