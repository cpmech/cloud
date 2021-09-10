import { Iany } from '@cpmech/js2ts';
import { ILambda, IResult, IEvent, IContext } from '../types';
import { checkParams } from './checkParams';
import { response } from '../response';

// makeHandlerWithQueryParams makes a Lambda handler for requests with Query data (e.g. GET)
function makeHandlerWithQueryParams<T extends Iany>(
  referenceQueryParams: T,
  func: (params: T) => Promise<IResult>,
): ILambda {
  return async (event: IEvent, context: IContext): Promise<IResult> => {
    // convert parameters
    let params: T;
    try {
      params = checkParams(referenceQueryParams, event.queryStringParameters);
    } catch (error) {
      return response.badRequest(`${error}`);
    }

    // call function
    try {
      return await func(params);
    } catch (error) {
      return response.serverError(`${error}`);
    }
  };
}

export { makeHandlerWithQueryParams };
