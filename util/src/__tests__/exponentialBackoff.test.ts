import { exponentialBackoff } from '../exponentialBackoff';

jest.setTimeout(10000);

describe('exponentialBackoff', () => {
  it('should return immediately', async () => {
    const t0 = Date.now();
    const res = await exponentialBackoff(async () => {
      return true;
    });
    const dt = Date.now() - t0;
    expect(res).toBeTruthy();
    expect(dt).toBeLessThan(100);
  });

  it('should succeed after some time', async () => {
    const maxAttempts = 5;
    const maxMilliseconds = 1000;
    const withJitter = false;
    let count = 0;
    const t0 = Date.now();
    const res = await exponentialBackoff(
      async () => {
        count++;
        if (count === 3) {
          return true;
        }
        return false;
      },
      maxAttempts,
      maxMilliseconds,
      withJitter,
    );
    const dt = Date.now() - t0;
    expect(res).toBeTruthy();
    expect(dt).toBeGreaterThan(400);
    expect(dt).toBeLessThan(700);
  });

  it('should succeed after some time (jitter)', async () => {
    const maxAttempts = 5;
    const maxMilliseconds = 1000;
    const withJitter = true;
    let count = 0;
    const t0 = Date.now();
    const res = await exponentialBackoff(
      async () => {
        count++;
        if (count === 3) {
          return true;
        }
        return false;
      },
      maxAttempts,
      maxMilliseconds,
      withJitter,
    );
    const dt = Date.now() - t0;
    expect(res).toBeTruthy();
    expect(dt).toBeGreaterThan(400);
    expect(dt).toBeLessThan(700);
  });

  it('should fail if action action fails', async () => {
    const res = await exponentialBackoff(async () => false, 1);
    expect(res).toBeFalsy();
  });

  it('should cap max delay', async () => {
    let count = 0;
    const res = await exponentialBackoff(
      async () => {
        count++;
        if (count === 2) {
          return true;
        }
        return false;
      },
      2,
      100,
    );
    expect(res).toBeTruthy();
  });
});
