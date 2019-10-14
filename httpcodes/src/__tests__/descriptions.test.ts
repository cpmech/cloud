import { status } from '../status';
import { descriptions } from '../descriptions';
import { hasProp } from '../util/hasProp';

describe('descriptions', () => {
  it('has the same fields as the status codes', () => {
    Object.keys(status).forEach(kind => {
      if (hasProp(descriptions, kind)) {
        const desc = (descriptions as any)[kind];
        Object.keys((status as any)[kind]).forEach(code => {
          if (!hasProp(desc, code)) {
            fail(`${kind}: '${code}' is missing`);
          }
        });
      } else {
        fail(`'${kind}' is missing`);
      }
    });
  });
});
