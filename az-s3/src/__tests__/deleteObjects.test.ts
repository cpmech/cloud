import { deleteObjects } from '../deleteObjects';

const BUCKET = 'TEST_BUCKET';

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
    const files = ['filekey1.png', 'filekey2.png'];
    fakePromise.promise.mockImplementationOnce(() =>
      Promise.resolve({
        Deleted: [{ Key: files[0] }, { Key: files[1] }],
      }),
    );
    const res = await deleteObjects(BUCKET, files);
    expect(res).toEqual(files);
  });
});
