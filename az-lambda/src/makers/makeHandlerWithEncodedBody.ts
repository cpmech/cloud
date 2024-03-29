import { Iany } from '@cpmech/js2ts';
import { ILambda, IResult, IEvent, IContext } from '../types';
import { checkParams } from './checkParams';
import { response } from '../response';
import { URLSearchParams } from 'url';

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
      const objParams = new URLSearchParams(event.body);
      const inputParams = Object.fromEntries(objParams);
      params = checkParams(referenceData, inputParams);
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

export { makeHandlerWithEncodedBody };
