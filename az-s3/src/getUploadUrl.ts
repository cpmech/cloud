import { S3 } from 'aws-sdk';
import { v4 } from 'uuid';
import { FileExtension, ext2type } from '@cpmech/basic';
import { IUploadUrl } from './types';

export const getUploadUrl = (
  bucket: string,
  fileExtension: FileExtension,
  prefix: string = '',
  expiresSeconds: number = 60,
  region: string = 'us-east-1',
): IUploadUrl => {
  const s3 = new S3({ region });
  const filekey = prefix + v4().replace(/-/g, '') + '.' + fileExtension;
  const url = s3.getSignedUrl('putObject', {
    Bucket: bucket,
    Key: filekey,
    ContentType: ext2type(fileExtension),
    Expires: expiresSeconds,
  });
  return {
    filekey,
    url,
  };
};
