// status stores most used http codes
export const status = {
  success: {
    ok: 200,
    created: 201,
    accepted: 202,
  },
  redirect: {
    movedPermanently: 301,
    found: 302, // moved temporarily
    seeOther: 303,
  },
  clientError: {
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    unprocessable: 422,
  },
  serverError: {
    internal: 500,
  },
};

export const statusCodes = {
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
};

export const code2status = {
  200: 'ok',
  201: 'created',
  202: 'accepted',
  301: 'movedPermanently',
  302: 'found',
  303: 'seeOther',
  400: 'badRequest',
  401: 'unauthorized',
  403: 'forbidden',
  404: 'notFound',
  422: 'unprocessable',
  500: 'internal',
};

/**
 * validateCode checks and converts a http code number
 * @param code - the http code candidate (type should be string or number)
 * @returns the validated code as number or null if it is invalid
 */
export const validateCode = (code: any): number | null => {
  if (typeof code !== 'string' && typeof code !== 'number') {
    return null;
  }
  const val = Number(code);
  if (isNaN(val) || !isFinite(val)) {
    return null;
  }
  if (Object.prototype.hasOwnProperty.call(code2status, val)) {
    return val;
  }
  return null;
};
