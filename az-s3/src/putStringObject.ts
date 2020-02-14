import { S3 } from 'aws-sdk';
import { fileExt2contentType, name2fileExt } from '@cpmech/util';

// put data on S3 and returns the filekey
// NOTE: the given filekey should have a FileExt
export const putStringObject = async (
  data: string,
  bucket: string,
  filekey: string,
  s3Config?: S3.ClientConfiguration,
): Promise<string> => {
  const ext = name2fileExt(filekey);
  const s3 = new S3(s3Config);
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
