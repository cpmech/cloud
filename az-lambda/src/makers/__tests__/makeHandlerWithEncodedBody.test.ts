import { status } from '@cpmech/httpcodes';
import querystring from 'querystring';
import { corsHeaders } from '../../response/corsHeaders';
import { response } from '../../response';
import { zeroEvent, zeroContext } from '../../zero';
import { makeHandlerWithEncodedBody } from '../makeHandlerWithEncodedBody';
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
  body: querystring.encode({ a: 'A', b: 'B' }),
};

const eventWrong: IEvent = {
  ...zeroEvent,
  body: querystring.encode({ aa: 'AA', b: 'B' }),
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

const s = JSON.stringify(zeroParams);
const m0 = 'hello world A B';
const m1a = `The input parameters are wrong.`;
const m1b = `The input parameters are wrong. The correct format is ${s}`;
const m2 = `STOP`;
const m3 = `event.body must be provided`;
const m4 = `The input parameters are wrong.`;
const b0 = JSON.stringify({ message: m0 });
const b1a = JSON.stringify({ errorMessage: m1a });
const b1b = JSON.stringify({ errorMessage: m1b });
const b2 = JSON.stringify({ errorMessage: m2 });
const b3 = JSON.stringify({ errorMessage: m3 });
const b4 = JSON.stringify({ errorMessage: m4 });

describe('makeHandlerWithEncodedBody', () => {
  it('works', async () => {
    const handler = makeHandlerWithEncodedBody(zeroParams, func);
    const res = await handler(eventCorrect, zeroContext);
    expect(res.statusCode).toBe(status.success.ok);
    expect(res.headers).toEqual(corsHeaders);
    expect(res.body).toEqual(b0);
  });

  it('fails [badRequest]', async () => {
    const handler = makeHandlerWithEncodedBody(zeroParams, func);
    const res = await handler(eventWrong, zeroContext);
    expect(res.statusCode).toBe(status.clientError.badRequest);
    expect(res.body).toEqual(b1a);
  });

  it('fails [internal server error]', async () => {
    const handler = makeHandlerWithEncodedBody(zeroParams, funcThatThrows);
    const res = await handler(eventCorrect, zeroContext);
    expect(res.statusCode).toBe(status.serverError.internal);
    expect(res.body).toEqual(b2);
  });

  it('fails (no body) [badRequest]', async () => {
    const handler = makeHandlerWithEncodedBody(zeroParams, func);
    const res = await handler(eventNoBody, zeroContext);
    expect(res.statusCode).toBe(status.clientError.badRequest);
    expect(res.body).toEqual(b3);
  });

  it('fails (empty body) [badRequest]', async () => {
    const handler = makeHandlerWithEncodedBody(zeroParams, func);
    const res = await handler(eventEmptyBody, zeroContext);
    expect(res.statusCode).toBe(status.clientError.badRequest);
    expect(res.body).toEqual(b3);
  });

  it('fails (body wrong) [badRequest]', async () => {
    const handler = makeHandlerWithEncodedBody(zeroParams, func);
    const res = await handler(eventBodyWrong, zeroContext);
    expect(res.statusCode).toBe(status.clientError.badRequest);
    expect(res.body).toEqual(b4);
  });
});

describe('makeHandlerWithEncodedBody (with feedback)', () => {
  it('works', async () => {
    switchWithFeedback();
    const handler = makeHandlerWithEncodedBody(zeroParams, func);
    const res = await handler(eventCorrect, zeroContext);
    expect(res.statusCode).toBe(status.success.ok);
    expect(res.headers).toEqual(corsHeaders);
    expect(res.body).toEqual(b0);
    switchWithFeedback();
  });

  it('fails [badRequest]', async () => {
    switchWithFeedback();
    const handler = makeHandlerWithEncodedBody(zeroParams, func);
    const res = await handler(eventWrong, zeroContext);
    expect(res.statusCode).toBe(status.clientError.badRequest);
    expect(res.body).toEqual(b1b);
    switchWithFeedback();
  });

  it('fails [internal server error]', async () => {
    switchWithFeedback();
    const handler = makeHandlerWithEncodedBody(zeroParams, funcThatThrows);
    const res = await handler(eventCorrect, zeroContext);
    expect(res.statusCode).toBe(status.serverError.internal);
    expect(res.body).toEqual(b2);
    switchWithFeedback();
  });
});
