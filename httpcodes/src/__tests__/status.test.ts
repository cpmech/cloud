import { status, statusCodes, code2status, validateCode } from '../status';

describe('success', () => {
  test('200', () => {
    expect(status.success.ok).toBe(200);
  });
  test('201', () => {
    expect(status.success.created).toBe(201);
  });
  test('202', () => {
    expect(status.success.accepted).toBe(202);
  });
});

describe('redirect', () => {
  test('301', () => {
    expect(status.redirect.movedPermanently).toBe(301);
  });
  test('302', () => {
    expect(status.redirect.found).toBe(302);
  });
  test('303', () => {
    expect(status.redirect.seeOther).toBe(303);
  });
});

describe('clientError', () => {
  test('400', () => {
    expect(status.clientError.badRequest).toBe(400);
  });
  test('401', () => {
    expect(status.clientError.unauthorized).toBe(401);
  });
  test('403', () => {
    expect(status.clientError.forbidden).toBe(403);
  });
  test('404', () => {
    expect(status.clientError.notFound).toBe(404);
  });
  test('422', () => {
    expect(status.clientError.unprocessable).toBe(422);
  });
});

describe('serverError', () => {
  test('500', () => {
    expect(status.serverError.internal).toBe(500);
  });
});

describe('statusCode', () => {
  it('should contain all codes', () => {
    expect(statusCodes).toStrictEqual({
      ok: 200,
      created: 201,
      accepted: 202,
      movedPermanently: 301,
      found: 302,
      seeOther: 303,
      badRequest: 400,
      unauthorized: 401,
      forbidden: 403,
      notFound: 404,
      unprocessable: 422,
      internal: 500,
    });
  });
});

describe('code2status', () => {
  it('should map back to statusCodes', () => {
    expect(Object.keys(code2status).map((k) => Number(k))).toStrictEqual(
      Object.values(statusCodes),
    );
    expect(Object.values(code2status)).toStrictEqual(Object.keys(statusCodes));
  });
});

describe('validateCode', () => {
  it('should capture invalid input', () => {
    expect(validateCode('')).toBeNull();
    expect(validateCode(undefined)).toBeNull();
    expect(validateCode(null)).toBeNull();
    expect(validateCode('nada')).toBeNull();
    expect(validateCode('-1')).toBeNull();
    expect(validateCode('0')).toBeNull();
    expect(validateCode('+1')).toBeNull();
    expect(validateCode([])).toBeNull();
    expect(validateCode({})).toBeNull();
    expect(validateCode({ crazy: 400 })).toBeNull();
  });
  it('should return correct values', () => {
    expect(validateCode('400')).toBe(400);
    expect(validateCode(400)).toBe(400);
    expect(validateCode('200')).toBe(200);
    expect(validateCode(200)).toBe(200);
  });
});
