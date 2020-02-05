import { S3 } from 'aws-sdk';
import { v4 } from 'uuid';

export const putStringObject = async (
  data: string,
  bucket: string,
  prefix: string = '',
  region: string = 'us-east-1',
): Promise<string> => {
  const s3 = new S3({ region });
  const filekey = prefix + v4().replace(/-/g, '') + '.txt';
  await s3
    .putObject({
      Bucket: bucket,
      Key: filekey,
      Body: data,
    })
    .promise();
  return filekey;
};
