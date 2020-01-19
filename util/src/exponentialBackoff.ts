import { sleep } from '@cpmech/basic';

// exponential backoff (with jitter)
// NOTE: the base component of backoff is fixed to ensure minimum total wait time on slow targets.
// Returns success flag
// REFS:
//  [1] https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/
//  [2] https://github.com/aws/aws-cdk/blob/db77bfecb98ffdcb092cf74bc7d79e6880a73b69/packages/%40aws-cdk/aws-certificatemanager/lambda-packages/dns_validated_certificate_handler/lib/index.js#L103
export const exponentialBackoff = async (
  action: () => Promise<boolean>,
  maxAttempts = 10,
  maxMilliseconds = 3600000, // 1 min
  withJitter = true,
  baseFixedMS = 150, // milliseconds
  baseMultMS = 50, // milliseconds
): Promise<boolean> => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const success = await action();
    if (success) {
      return true; // success
    }
    const x = Math.pow(2, attempt);
    let dt = withJitter
      ? (baseFixedMS + baseMultMS * Math.random()) * x
      : (baseFixedMS + baseMultMS) * x;
    if (dt > maxMilliseconds) {
      dt = maxMilliseconds;
    }
    await sleep(dt);
  }
  return false; // fail
};
