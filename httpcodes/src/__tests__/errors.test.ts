import {
  ErrorValidation,
  ErrorBadRequest,
  ErrorUnauthorized,
  ErrorForbidden,
  ErrorNotFound,
  ErrorUnprocessable,
  ErrorInternal,
} from '../errors';
import { status } from '../status';
import { descriptions } from '../descriptions';

describe('ErrorValidation', () => {
  it('holds the data properly', () => {
    const err = new ErrorValidation([
      { field: 'email', message: 'email is invalid' },
      { field: 'password', message: 'password needs 8 characters' },
      { field: 'password', message: 'password needs capital letters' },
    ]);
    expect(err.code).toBe(status.clientError.badRequest);
    expect(err.state).toEqual({
      email: ['email is invalid'],
      password: ['password needs 8 characters', 'password needs capital letters'],
    });
  });
});

describe('ErrorBadRequest', () => {
  it('sets the default message', () => {
    const err = new ErrorBadRequest();
    expect(err.message).toBe(descriptions.clientError.badRequest);
  });
  it('handles custom message', () => {
    const err = new ErrorBadRequest('Dados Inválidos');
    expect(err.message).toBe('Dados Inválidos');
  });
});

describe('ErrorUnauthorized', () => {
  it('sets the default message', () => {
    const err = new ErrorUnauthorized();
    expect(err.message).toBe(descriptions.clientError.unauthorized);
  });
  it('handles custom message', () => {
    const err = new ErrorUnauthorized('Acesso Negado');
    expect(err.message).toBe('Acesso Negado');
  });
});

describe('ErrorForbidden', () => {
  it('sets the default message', () => {
    const err = new ErrorForbidden();
    expect(err.message).toBe(descriptions.clientError.forbidden);
  });
  it('handles custom message', () => {
    const err = new ErrorForbidden('Proibido');
    expect(err.message).toBe('Proibido');
  });
});

describe('ErrorNotFound', () => {
  it('sets the default message', () => {
    const err = new ErrorNotFound();
    expect(err.message).toBe(descriptions.clientError.notFound);
  });
  it('handles custom message', () => {
    const err = new ErrorNotFound('Não Encontrado');
    expect(err.message).toBe('Não Encontrado');
  });
});

describe('ErrorUnprocessable', () => {
  it('sets the default message', () => {
    const err = new ErrorUnprocessable();
    expect(err.message).toBe(descriptions.clientError.unprocessable);
  });
  it('handles custom message', () => {
    const err = new ErrorUnprocessable('Impossível');
    expect(err.message).toBe('Impossível');
  });
});

describe('ErrorInternal', () => {
  it('sets the default message', () => {
    const err = new ErrorInternal();
    expect(err.message).toBe(descriptions.serverError.internal);
  });
  it('handles custom message', () => {
    const err = new ErrorInternal('Interno');
    expect(err.message).toBe('Interno');
  });
});
