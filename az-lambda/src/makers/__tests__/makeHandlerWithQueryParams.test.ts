import { status } from '@cpmech/httpcodes';
import { corsHeaders } from '../../response/corsHeaders';
import { response } from '../../response';
import { zeroEvent, zeroContext } from '../../zero';
import { makeHandlerWithQueryParams } from '../makeHandlerWithQueryParams';
import { IResult, IEvent } from '../../types';
import { switchWithFeedback } from '../../helpers';

interface IParams {
  a: string;
  b: string;
}

const func = async (params: IParams): Promise<IResult> =>
  response.ok({ message: `hello world ${params.a} ${params.b}` });

const funcThatThrows = async (params: IParams): Promise<IResult> => {
  throw new Error('STOP');
};

const zeroParams: IParams = { a: '', b: '' };

const eventCorrect: IEvent = {
  ...zeroEvent,
  queryStringParameters: { a: 'A', b: 'B' },
};

const eventWrong: IEvent = {
  ...zeroEvent,
  queryStringParameters: { aa: 'AA', b: 'B' },
};

const s = JSON.stringify(zeroParams);
const m0 = 'hello world A B';
const m1a = `[ERROR] The input parameters are wrong.`;
const m1b = `[ERROR] The input parameters are wrong. The correct format is ${s}`;
const m2 = `[ERROR] ${'STOP'}`;
const b0 = JSON.stringify({ message: m0 });
const b1a = JSON.stringify({ errorMessage: m1a });
const b1b = JSON.stringify({ errorMessage: m1b });
const b2 = JSON.stringify({ errorMessage: m2 });

describe('makeHandlerWithQueryParams', () => {
  test('it works', async () => {
    const handler = makeHandlerWithQueryParams(zeroParams, func);
    const res = await handler(eventCorrect, zeroContext);
    expect(res.statusCode).toBe(status.success.ok);
    expect(res.headers).toEqual(corsHeaders);
    expect(res.body).toEqual(b0);
  });

  test('it fails [badRequest]', async () => {
    const handler = makeHandlerWithQueryParams(zeroParams, func);
    const res = await handler(eventWrong, zeroContext);
    expect(res.statusCode).toBe(status.clientError.badRequest);
    expect(res.body).toEqual(b1a);
  });

  test('it fails [internal server error]', async () => {
    const handler = makeHandlerWithQueryParams(zeroParams, funcThatThrows);
    const res = await handler(eventCorrect, zeroContext);
    expect(res.statusCode).toBe(status.serverError.internal);
    expect(res.body).toEqual(b2);
  });
});

describe('makeHandlerWithQueryParams (with feedback)', () => {
  test('it works', async () => {
    switchWithFeedback();
    const handler = makeHandlerWithQueryParams(zeroParams, func);
    const res = await handler(eventCorrect, zeroContext);
    expect(res.statusCode).toBe(status.success.ok);
    expect(res.headers).toEqual(corsHeaders);
    expect(res.body).toEqual(b0);
    switchWithFeedback();
  });

  test('it fails [badRequest]', async () => {
    switchWithFeedback();
    const handler = makeHandlerWithQueryParams(zeroParams, func);
    const res = await handler(eventWrong, zeroContext);
    expect(res.statusCode).toBe(status.clientError.badRequest);
    expect(res.body).toEqual(b1b);
    switchWithFeedback();
  });

  test('it fails [internal server error]', async () => {
    switchWithFeedback();
    const handler = makeHandlerWithQueryParams(zeroParams, funcThatThrows);
    const res = await handler(eventCorrect, zeroContext);
    expect(res.statusCode).toBe(status.serverError.internal);
    expect(res.body).toEqual(b2);
    switchWithFeedback();
  });
});
