import { Iany } from '@cpmech/js2ts';
import { ILambda, IResult, IEvent, IContext } from '../types';
import { checkParams } from './checkParams';
import { response } from '../response';

// makeHandlerWithJsonBody makes a Lambda handler for requests with JSON data (e.g. POST)
function makeHandlerWithJsonBody<T extends Iany>(
  referenceJsonBody: T,
  func: (params: T) => Promise<IResult>,
): ILambda {
  return async (event: IEvent, context: IContext): Promise<IResult> => {
    // check body data
    if (!event.body) {
      return response.badRequest(`JSON data (as a string) must be given in event.body`);
    }

    // convert parameters
    let params: T;
    try {
      const inputParams = JSON.parse(event.body);
      params = checkParams(referenceJsonBody, inputParams);
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

export { makeHandlerWithJsonBody };
