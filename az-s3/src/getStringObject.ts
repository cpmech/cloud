import { S3 } from 'aws-sdk';

export const getStringObject = async (
  bucket: string,
  filekey: string,
  region: string = 'us-east-1',
): Promise<string> => {
  const s3 = new S3({ region });
  const res = await s3
    .getObject({
      Bucket: bucket,
      Key: filekey,
    })
    .promise();
  if (!res || !res.Body) {
    throw new Error(`cannot get string object with filekey = ${filekey}`);
  }
  return String(res.Body);
};
