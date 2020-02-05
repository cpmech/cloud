import { putStringObject } from '../putStringObject';

const BUCKET = 'testing-cloud-az-s3';

const fakePromise = {
  promise: jest.fn(),
};

jest.mock('aws-sdk', () => ({
  S3: jest.fn(() => ({
    putObject: () => fakePromise,
  })),
}));

jest.mock('uuid', () => ({
  v4: () => `my-uuid-goes-here`,
}));

describe('putStringObject', () => {
  it('should put new object made up by a string data', async () => {
    const filekey = await putStringObject('Hello World', BUCKET);
    expect(filekey).toBe('myuuidgoeshere.txt');
  });
});
