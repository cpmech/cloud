import { S3 } from 'aws-sdk';
import { v4 } from 'uuid';

// returns the filekey
export const putStringObject = async (
  data: string,
  bucket: string,
  filekey?: string, // set filekey directly => will not use UUID
  prefix = '', // if filekey is given, this is ignored; othewise will be pre-added to UUID
  region = 'us-east-1',
): Promise<string> => {
  const s3 = new S3({ region });
  if (!filekey) {
    filekey = prefix + v4().replace(/-/g, '') + '.txt';
  }
  await s3
    .putObject({
      Bucket: bucket,
      Key: filekey,
      Body: data,
    })
    .promise();
  return filekey;
};
