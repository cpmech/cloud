import { status } from './status';
import { descriptions } from './descriptions';
import { hasProp } from './util/hasProp';

export interface ErrorValidationEntry {
  field: string;
  message: string;
}

export interface IValidationState {
  [field: string]: string[]; // maps field to array of messages
}

// ErrorValidation holds Validation Errors
export class ErrorValidation extends Error {
  code = status.clientError.badRequest;
  state: IValidationState;
  constructor(errors: ErrorValidationEntry[]) {
    super(descriptions.clientError.badRequest);
    this.state = errors.reduce(
      (acc, curr) => {
        if (hasProp(acc, curr.field)) {
          acc[curr.field].push(curr.message);
        } else {
          acc[curr.field] = [curr.message];
        }
        return acc;
      },
      {} as IValidationState,
    );
  }
}

// ErrorBadRequest holds BadRequest Errors
export class ErrorBadRequest extends Error {
  code = status.clientError.badRequest;
  constructor(message: string = descriptions.clientError.badRequest) {
    super(message);
  }
}

// ErrorUnauthorized holds Unauthorized Errors
export class ErrorUnauthorized extends Error {
  code = status.clientError.unauthorized;
  constructor(message: string = descriptions.clientError.unauthorized) {
    super(message);
  }
}

// ErrorForbidden holds Forbidden Errors
export class ErrorForbidden extends Error {
  code = status.clientError.forbidden;
  constructor(message: string = descriptions.clientError.forbidden) {
    super(message);
  }
}

// ErrorNotFound holds NotFound Errors
export class ErrorNotFound extends Error {
  code = status.clientError.notFound;
  constructor(message: string = descriptions.clientError.notFound) {
    super(message);
  }
}

// ErrorUnprocessable holds Unprocessable Errors
export class ErrorUnprocessable extends Error {
  code = status.clientError.unprocessable;
  constructor(message: string = descriptions.clientError.unprocessable) {
    super(message);
  }
}

// ErrorInternal holds Internal Errors
export class ErrorInternal extends Error {
  code = status.serverError.internal;
  constructor(message: string = descriptions.serverError.internal) {
    super(message);
  }
}
