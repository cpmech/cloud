import { S3 } from 'aws-sdk';
import { v4 } from 'uuid';
import { IUploadUrl } from './types';
import { FileExtension, ext2type } from './fileTypeAndExt';

export const getUploadUrl = (
  bucket: string,
  fileExtension: FileExtension,
  region: string = 'us-east-1',
): IUploadUrl => {
  const s3 = new S3({ region });
  const filekey = v4().replace(/-/g, '') + '.' + fileExtension;
  const url = s3.getSignedUrl('putObject', {
    Bucket: bucket,
    Key: filekey,
    ContentType: ext2type(fileExtension),
  });
  return {
    filekey,
    url,
  };
};
