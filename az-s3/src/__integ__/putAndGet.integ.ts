import AWS from 'aws-sdk';
import { deleteObjects } from '../deleteObjects';
import { putStringObject } from '../putStringObject';
import { getStringObject } from '../getStringObject';

jest.setTimeout(10000);

AWS.config.update({
  region: 'us-east-1',
});

const BUCKET = 'testing-cloud-az-s3';

const loremIpsum = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla varius cursus pulvinar. Sed a libero tortor. Cras dignissim pharetra nibh, quis varius enim consectetur id. Aenean molestie lacinia ligula, id facilisis turpis. Suspendisse gravida nisl pretium, malesuada neque ac, venenatis purus. Fusce tempus tellus id nunc sagittis, a tempus risus sodales. Etiam vitae commodo elit. Donec eu vehicula dui, eu molestie dolor.

Nam mattis hendrerit convallis. In viverra neque mauris, sit amet tempor libero tincidunt vel. Nunc molestie eleifend pellentesque. Nunc tincidunt tortor nec dui tempus, et elementum erat gravida. Ut ornare augue sit amet tellus tempor, sit amet pretium metus laoreet. Vivamus dictum, urna sed mollis feugiat, nibh sapien fermentum purus, nec fringilla mauris purus ut sapien. Curabitur malesuada aliquet sapien, nec dapibus sem lacinia sed. Pellentesque mi ligula, malesuada vel feugiat eu, iaculis eget metus.

Etiam semper, augue nec vestibulum mattis, leo massa vestibulum nunc, sit amet hendrerit dolor nibh a felis. Curabitur felis lectus, posuere at facilisis sed, mattis non lacus. Quisque ullamcorper erat in neque elementum molestie. Curabitur et lacus orci. In vitae magna tellus. Curabitur sodales, felis sed auctor bibendum, diam turpis posuere enim, eget elementum tortor risus non neque. Donec facilisis, nulla ac fermentum venenatis, massa dolor interdum mauris, vitae consectetur lorem ante id risus. Sed dictum neque sit amet sollicitudin molestie. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aliquam eget bibendum neque. Praesent laoreet, ante sit amet hendrerit dignissim, dolor massa pharetra lorem, in volutpat augue nisl ac erat. Fusce elementum sed odio et vulputate.

Generated 3 paragraphs, 283 words, 1940 bytes of Lorem Ipsum
`;

const filekeys = [
  'signature_00000018-epop-coop-xxxx-123456789012.txt',
  'signature_27a1b4de-5d0d-4911-b529-afcf3c2c192a.txt',
  'signature_Facebook_2949576241738108.txt',
];

afterAll(async () => {
  await deleteObjects(BUCKET, filekeys);
});

describe('putStringObject', () => {
  it('should put new object made up by a string data', async () => {
    for (const filekey of filekeys) {
      await putStringObject(loremIpsum, BUCKET, filekey);
      const data = await getStringObject(BUCKET, filekey);
      expect(data).toBe(loremIpsum);
    }
  });
});
