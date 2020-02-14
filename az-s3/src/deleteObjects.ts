import { S3 } from 'aws-sdk';

// returns the filekeys of those deleted successfully
export const deleteObjects = async (
  bucket: string,
  filekeys: string[],
  quiet = true,
  s3Config?: S3.ClientConfiguration,
): Promise<string[]> => {
  const s3 = new S3(s3Config);

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

  return Deleted.reduce((acc, curr) => {
    if (curr.Key) {
      acc.push(curr.Key);
    }
    return acc;
  }, [] as string[]);
};
