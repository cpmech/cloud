import { getUploadUrl } from '../getUploadUrl';

const BUCKET = 'testing-cloud-az-s3';

jest.mock('uuid', () => ({
  v4: () => '666-666',
}));

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

  it('should throw error due to missing data', () => {
    expect(() => getUploadUrl(BUCKET)).toThrowError(
      'file extension must be given either in filekey or via fileExt',
    );
  });

  it('should return url (using given filekey)', () => {
    expect(getUploadUrl(BUCKET, 'given-filekey.doc')).toEqual({
      filekey: 'given-filekey.doc',
      url: 'http://localhost/given-filekey.doc',
    });
  });

  it('should return url (using fileExt)', () => {
    expect(getUploadUrl(BUCKET, undefined, 'pdf')).toEqual({
      filekey: '666666.pdf',
      url: 'http://localhost/666666.pdf',
    });
  });

  it('should return url (using prefix)', () => {
    expect(getUploadUrl(BUCKET, undefined, 'pdf', 'PREFIX')).toEqual({
      filekey: 'PREFIX666666.pdf',
      url: 'http://localhost/PREFIX666666.pdf',
    });
  });
});
