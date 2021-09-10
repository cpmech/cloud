import { Iany, checkType } from '@cpmech/js2ts';

// any2params converts any input to typed-parameters.
// on success, returns the typed parameters
// on failure, throws error
function checkParams<T extends Iany>(referenceParams: T, inputParams: any): T {
  const params = checkType(referenceParams, inputParams);
  if (params) {
    return params;
  }
  throw new Error(`The input parameters are wrong.`);
}

export { checkParams };
