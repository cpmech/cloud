import { S3 } from 'aws-sdk';
import { v4 } from 'uuid';
import { fileExt2contentType, name2fileExt } from '@cpmech/util';

// put data on S3 and returns the filekey
// NOTE: the given filekey should have a FileExt
export const putStringObject = async (
  data: string,
  bucket: string,
  filekey?: string, // set filekey directly => will not use UUID
  prefix = '', // ignored if filekey is given; othewise will be pre-added to UUID
  region = 'us-east-1',
): Promise<string> => {
  const s3 = new S3({ region });
  if (!filekey) {
    filekey = prefix + v4().replace(/-/g, '') + '.txt';
  }
  const ext = name2fileExt(filekey);
  await s3
    .putObject({
      Bucket: bucket,
      Key: filekey,
      Body: data,
      ContentType: fileExt2contentType[ext],
    })
    .promise();
  return filekey;
};
