import { S3 } from 'aws-sdk';

// returns the filekeys of those deleted successfully
export const deleteObjects = async (
  bucket: string,
  filekeys: string[],
  region: string = 'us-east-1',
  quiet = true,
) => {
  const s3 = new S3({ region });
  const res = await s3
    .deleteObjects({
      Bucket: bucket,
      Delete: {
        Objects: filekeys.map(k => ({ Key: k })),
        Quiet: quiet,
      },
    })
    .promise();
  const { Deleted } = res;
  if (!Deleted) {
    throw new Error('cannot delete objects');
  }
  return Deleted.map(d => d.Key);
};
