import { deleteObjects } from '../deleteObjects';

const BUCKET = 'testing-cloud-az-s3';

const fakePromise = {
  promise: jest.fn(),
};

jest.mock('aws-sdk', () => ({
  S3: jest.fn(() => ({
    deleteObjects: () => fakePromise,
  })),
}));

describe('deleteObjects', () => {
  it('should delete objects', async () => {
    const files = ['filekey1.png', 'filekey2.png', 'inexistentFile.png'];
    fakePromise.promise.mockImplementationOnce(() =>
      Promise.resolve({
        Deleted: [{ Key: files[0] }, { Key: files[1] }, { Key: undefined }],
      }),
    );
    const res = await deleteObjects(BUCKET, files);
    expect(res).toEqual(['filekey1.png', 'filekey2.png']);
  });
});
