import { S3 } from 'aws-sdk';
import { fileExt2contentType, name2fileExt } from '@cpmech/util';

// get upload URL
export const getUploadUrl = (
  bucket: string,
  filekey: string,
  expiresSeconds = 60,
  s3Config?: S3.ClientConfiguration,
): string => {
  const ext = name2fileExt(filekey);
  if (!ext) {
    throw new Error('file extension must be given in filekey');
  }

  const s3 = new S3(s3Config);
  const url = s3.getSignedUrl('putObject', {
    Bucket: bucket,
    Key: filekey,
    ContentType: fileExt2contentType[ext],
    Expires: expiresSeconds,
  });

  return url;
};
