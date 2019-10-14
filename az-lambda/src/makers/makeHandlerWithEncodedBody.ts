import { Iany } from '@cpmech/js2ts';
import querystring from 'querystring';
import { ILambda, IResult, IEvent, IContext } from '../types';
import { any2params } from './any2params';
import { response } from '../response';

// makeHandlerWithEncodedBody makes a Lambda handler for requests with URL encoded data (e.g. HTML forms using POST)
function makeHandlerWithEncodedBody<T extends Iany>(
  referenceData: T,
  func: (params: T) => Promise<IResult>,
): ILambda {
  return async (event: IEvent, context: IContext): Promise<IResult> => {
    // check body data
    if (!event.body) {
      return response.badRequest(`event.body must be provided`);
    }

    // convert parameters
    let params: T;
    try {
      const inputParams = querystring.parse(event.body);
      params = any2params(referenceData, inputParams);
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

export { makeHandlerWithEncodedBody };
