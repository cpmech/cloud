import { WITH_FEEDBACK } from '../helpers/constants';
import { Iany, checkType } from '@cpmech/js2ts';

// any2params converts any input to typed-parameters.
// on success, returns the typed parameters
// on failure, throws error
// WITH_FEEDBACK adds the string representation of the reference into the error message
function checkParams<T extends Iany>(referenceParams: T, inputParams: any): T {
  const params = checkType(referenceParams, inputParams);
  if (params) {
    return params;
  }
  if (WITH_FEEDBACK) {
    const s = JSON.stringify(referenceParams);
    throw new Error(`The input parameters are wrong. The correct format is ${s}`);
  }
  throw new Error(`The input parameters are wrong.`);
}

export { checkParams };
