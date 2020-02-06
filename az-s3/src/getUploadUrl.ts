import { S3 } from 'aws-sdk';
import { v4 } from 'uuid';
import { FileExt, fileExt2contentType, name2fileExt } from '@cpmech/util';
import { IUploadUrl } from './types';

// get upload URL
// NOTE: (1) you can give either "filekey" or "fileExt"
//       (2) the given filekey must have a FileExt
export const getUploadUrl = (
  bucket: string,
  filekey?: string, // set filekey directly => will not use UUID
  fileExt?: FileExt, // will use UUID
  prefix = '', // ignored if filekey is given; othewise will be pre-added to UUID
  expiresSeconds = 60,
  region = 'us-east-1',
): IUploadUrl => {
  const s3 = new S3({ region });
  const ext = filekey ? name2fileExt(filekey) : fileExt;
  if (!ext) {
    throw new Error('file extension must be given either in filekey or via fileExt');
  }
  if (!filekey) {
    filekey = prefix + v4().replace(/-/g, '') + '.' + fileExt;
  }
  const url = s3.getSignedUrl('putObject', {
    Bucket: bucket,
    Key: filekey,
    ContentType: fileExt2contentType[ext],
    Expires: expiresSeconds,
  });
  return {
    filekey,
    url,
  };
};
