import { S3 } from 'aws-sdk';
import { v4 } from 'uuid';
import { IUploadUrl } from './types';

export const getUploadUrl = (bucket: string, region: string = 'us-east-1'): IUploadUrl => {
  const s3 = new S3({ region });
  const filekey = v4().replace(/-/g, '');
  const url = s3.getSignedUrl('putObject', {
    Bucket: bucket,
    Key: filekey,
  });
  return {
    filekey,
    url,
  };
};
