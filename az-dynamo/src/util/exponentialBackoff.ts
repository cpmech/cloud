import { sleep } from '@cpmech/basic';

// TODO: test this

export const exponentialBackoff = async (action: () => Promise<boolean>, maxAttempts = 10) => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const success = await action();
    if (success) {
      return;
    }
    // Exponential backoff with jitter based on 200ms base
    // component of backoff fixed to ensure minimum total wait time on
    // slow targets.
    const base = Math.pow(2, attempt);
    await sleep(Math.random() * base * 50 + base * 150);
  }
};
