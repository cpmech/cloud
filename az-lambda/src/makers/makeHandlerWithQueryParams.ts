import { Iany } from '@cpmech/js2ts';
import { ILambda, IResult, IEvent, IContext } from '../types';
import { any2params } from './any2params';
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
      params = any2params(referenceQueryParams, event.queryStringParameters);
    } catch (error) {
      return response.badRequest(error.message);
    }

    // call function
    try {
      return await func(params);
    } catch (error) {
      return response.serverError(error.message);
    }
  };
}

export { makeHandlerWithQueryParams };
