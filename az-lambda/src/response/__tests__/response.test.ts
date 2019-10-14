import { response } from '../index';
import { corsHeaders } from '../corsHeaders';

const data = { a: 'data' };
const headers = { Authorization: 'Bearer TOKEN_GOES_HERE' };

describe('response', () => {
  test('ok works', () => {
    expect(response.ok(data)).toEqual({
      statusCode: 200,
      headers: corsHeaders,
      body: '{"a":"data"}',
    });
  });

  test('created works', () => {
    expect(response.created(data)).toEqual({
      statusCode: 201,
      headers: corsHeaders,
      body: '{"a":"data"}',
    });
  });

  test('accepted works', () => {
    expect(response.accepted(data)).toEqual({
      statusCode: 202,
      headers: corsHeaders,
      body: '{"a":"data"}',
    });
  });

  test('badRequest works', () => {
    expect(response.badRequest('400')).toEqual({
      statusCode: 400,
      headers: corsHeaders,
      body: '{"errorMessage":"[ERROR] 400"}',
    });
  });

  test('unauthorized works', () => {
    expect(response.unauthorized('401')).toEqual({
      statusCode: 401,
      headers: corsHeaders,
      body: '{"errorMessage":"[ERROR] 401"}',
    });
  });

  test('forbidden works', () => {
    expect(response.forbidden('403')).toEqual({
      statusCode: 403,
      headers: corsHeaders,
      body: '{"errorMessage":"[ERROR] 403"}',
    });
  });

  test('notFound works', () => {
    expect(response.notFound('404')).toEqual({
      statusCode: 404,
      headers: corsHeaders,
      body: '{"errorMessage":"[ERROR] 404"}',
    });
  });

  test('unprocessable works', () => {
    expect(response.unprocessable('422')).toEqual({
      statusCode: 422,
      headers: corsHeaders,
      body: '{"errorMessage":"[ERROR] 422"}',
    });
  });

  test('serverError works', () => {
    expect(response.serverError('500')).toEqual({
      statusCode: 500,
      headers: corsHeaders,
      body: '{"errorMessage":"[ERROR] 500"}',
    });
  });
});

describe('response (with headers)', () => {
  test('ok works', () => {
    expect(response.ok(data, headers)).toEqual({
      statusCode: 200,
      headers: { ...headers, ...corsHeaders },
      body: '{"a":"data"}',
    });
  });

  test('created works', () => {
    expect(response.created(data, headers)).toEqual({
      statusCode: 201,
      headers: { ...headers, ...corsHeaders },
      body: '{"a":"data"}',
    });
  });

  test('accepted works', () => {
    expect(response.accepted(data, headers)).toEqual({
      statusCode: 202,
      headers: { ...headers, ...corsHeaders },
      body: '{"a":"data"}',
    });
  });

  test('badRequest works', () => {
    expect(response.badRequest('400', headers)).toEqual({
      statusCode: 400,
      headers: { ...headers, ...corsHeaders },
      body: '{"errorMessage":"[ERROR] 400"}',
    });
  });

  test('unauthorized works', () => {
    expect(response.unauthorized('401', headers)).toEqual({
      statusCode: 401,
      headers: { ...headers, ...corsHeaders },
      body: '{"errorMessage":"[ERROR] 401"}',
    });
  });

  test('forbidden works', () => {
    expect(response.forbidden('403', headers)).toEqual({
      statusCode: 403,
      headers: { ...headers, ...corsHeaders },
      body: '{"errorMessage":"[ERROR] 403"}',
    });
  });

  test('notFound works', () => {
    expect(response.notFound('404', headers)).toEqual({
      statusCode: 404,
      headers: { ...headers, ...corsHeaders },
      body: '{"errorMessage":"[ERROR] 404"}',
    });
  });

  test('unprocessable works', () => {
    expect(response.unprocessable('422', headers)).toEqual({
      statusCode: 422,
      headers: { ...headers, ...corsHeaders },
      body: '{"errorMessage":"[ERROR] 422"}',
    });
  });

  test('serverError works', () => {
    expect(response.serverError('500', headers)).toEqual({
      statusCode: 500,
      headers: { ...headers, ...corsHeaders },
      body: '{"errorMessage":"[ERROR] 500"}',
    });
  });
});

describe('response (using rawData)', () => {
  test('ok works', () => {
    expect(response.ok(data, undefined, true)).toEqual({
      statusCode: 200,
      headers: corsHeaders,
      body: data,
    });
  });

  test('created works', () => {
    expect(response.created(data, undefined, true)).toEqual({
      statusCode: 201,
      headers: corsHeaders,
      body: data,
    });
  });

  test('accepted works', () => {
    expect(response.accepted(data, undefined, true)).toEqual({
      statusCode: 202,
      headers: corsHeaders,
      body: data,
    });
  });

  test('badRequest works', () => {
    expect(response.badRequest('400', undefined, true)).toEqual({
      statusCode: 400,
      headers: corsHeaders,
      body: '400',
    });
  });

  test('unauthorized works', () => {
    expect(response.unauthorized('401', undefined, true)).toEqual({
      statusCode: 401,
      headers: corsHeaders,
      body: '401',
    });
  });

  test('forbidden works', () => {
    expect(response.forbidden('403', undefined, true)).toEqual({
      statusCode: 403,
      headers: corsHeaders,
      body: '403',
    });
  });

  test('notFound works', () => {
    expect(response.notFound('404', undefined, true)).toEqual({
      statusCode: 404,
      headers: corsHeaders,
      body: '404',
    });
  });

  test('unprocessable works', () => {
    expect(response.unprocessable('422', undefined, true)).toEqual({
      statusCode: 422,
      headers: corsHeaders,
      body: '422',
    });
  });

  test('serverError works', () => {
    expect(response.serverError('500', undefined, true)).toEqual({
      statusCode: 500,
      headers: corsHeaders,
      body: '500',
    });
  });
});
