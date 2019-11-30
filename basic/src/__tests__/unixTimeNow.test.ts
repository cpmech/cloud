import { unixTimeNow } from '../unixTimeNow';

describe('unixTimeNow', () => {
  it('should return unix time in seconds', () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementationOnce(() => new Date('2019-11-23T04:05:07+00:00').valueOf());
    expect(unixTimeNow()).toBe(1574481907);
  });
});
