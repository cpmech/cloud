import { status } from '@cpmech/httpcodes';
import { corsHeaders } from '../../response/corsHeaders';
import { response } from '../../response';
import { zeroEvent, zeroContext } from '../../zero';
import { makeHandlerWithJsonBody } from '../makeHandlerWithJsonBody';
import { IResult, IEvent } from '../../types';

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
  body: JSON.stringify({ a: 'A', b: 'B' }),
};

const eventWrong: IEvent = {
  ...zeroEvent,
  body: JSON.stringify({ aa: 'AA', b: 'B' }),
};

const eventNoBody: IEvent = {
  ...zeroEvent,
};

const eventEmptyBody: IEvent = {
  ...zeroEvent,
  body: '',
};

const eventBodyWrong: IEvent = {
  ...zeroEvent,
  body: 'wrong',
};

const m0 = 'hello world A B';
const m1a = `Error: The input parameters are wrong.`;
const m1b = `Error: The input parameters are wrong.`;
const m2 = `Error: STOP`;
const m3 = `JSON data (as a string) must be given in event.body`;
const m4 = `SyntaxError: Unexpected token w in JSON at position 0`;
const b0 = JSON.stringify({ message: m0 });
const b1a = JSON.stringify({ errorMessage: m1a });
const b1b = JSON.stringify({ errorMessage: m1b });
const b2 = JSON.stringify({ errorMessage: m2 });
const b3 = JSON.stringify({ errorMessage: m3 });
const b4 = JSON.stringify({ errorMessage: m4 });

describe('makeHandlerWithJsonBody', () => {
  test('it works', async () => {
    const handler = makeHandlerWithJsonBody(zeroParams, func);
    const res = await handler(eventCorrect, zeroContext);
    expect(res.statusCode).toBe(status.success.ok);
    expect(res.headers).toEqual(corsHeaders);
    expect(res.body).toEqual(b0);
  });

  test('it fails [badRequest]', async () => {
    const handler = makeHandlerWithJsonBody(zeroParams, func);
    const res = await handler(eventWrong, zeroContext);
    expect(res.statusCode).toBe(status.clientError.badRequest);
    expect(res.body).toEqual(b1a);
  });

  test('it fails [internal server error]', async () => {
    const handler = makeHandlerWithJsonBody(zeroParams, funcThatThrows);
    const res = await handler(eventCorrect, zeroContext);
    expect(res.statusCode).toBe(status.serverError.internal);
    expect(res.body).toEqual(b2);
  });

  test('it fails (no body) [badRequest]', async () => {
    const handler = makeHandlerWithJsonBody(zeroParams, func);
    const res = await handler(eventNoBody, zeroContext);
    expect(res.statusCode).toBe(status.clientError.badRequest);
    expect(res.body).toEqual(b3);
  });

  test('it fails (empty body) [badRequest]', async () => {
    const handler = makeHandlerWithJsonBody(zeroParams, func);
    const res = await handler(eventEmptyBody, zeroContext);
    expect(res.statusCode).toBe(status.clientError.badRequest);
    expect(res.body).toEqual(b3);
  });

  test('it fails (body wrong) [badRequest]', async () => {
    const handler = makeHandlerWithJsonBody(zeroParams, func);
    const res = await handler(eventBodyWrong, zeroContext);
    expect(res.statusCode).toBe(status.clientError.badRequest);
    expect(res.body).toEqual(b4);
  });
});
