import { getDownloadUrl } from '../getDownloadUrl';

const BUCKET = 'testing-cloud-az-s3';

jest.mock('aws-sdk', () => ({
  S3: jest.fn(() => ({
    getSignedUrl: (operation: string, params: any) => {
      const { Bucket, Key } = params;
      if (Bucket === BUCKET && operation === 'getObject') {
        return `http://localhost/${Key}`;
      }
      throw new Error('bucket or operation is invalid');
    },
  })),
}));

describe('getDownloadUrl', () => {
  it('should return url', () => {
    expect(getDownloadUrl(BUCKET, '123-456')).toBe('http://localhost/123-456');
  });
});
