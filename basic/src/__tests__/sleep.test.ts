import { sleep } from '../index';

describe('sleep', () => {
  test('works', async () => {
    await sleep(10);
  });
});
