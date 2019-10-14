import { status } from '../status';

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
