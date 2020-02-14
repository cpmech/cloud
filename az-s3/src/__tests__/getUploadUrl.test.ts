import { getUploadUrl } from '../getUploadUrl';

const BUCKET = 'testing-cloud-az-s3';

jest.mock('aws-sdk', () => ({
  S3: jest.fn(() => ({
    getSignedUrl: (operation: string, params: any) => {
      const { Bucket, Key } = params;
      if (Bucket === BUCKET && operation === 'putObject') {
        return `http://localhost/${Key}`;
      }
      throw new Error('bucket or operation is invalid');
    },
  })),
}));

describe('getUploadUrl', () => {
  it('should throw error due to invalid fileExt', () => {
    expect(() => getUploadUrl(BUCKET, 'filekey.doca')).toThrowError(
      'file extension (doca) is invalid',
    );
  });

  it('should throw error due to missing extension', () => {
    expect(() => getUploadUrl(BUCKET, 'nada')).toThrowError('filename does not have extension');
  });

  it('should return url (using given filekey)', () => {
    expect(getUploadUrl(BUCKET, 'given-filekey.doc')).toBe('http://localhost/given-filekey.doc');
  });
});
