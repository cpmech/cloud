// Descriptions from https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
export const descriptions = {
  success: {
    ok: '200-OK: The request has succeeded',
    created: '201-Created: The request has succeeded and a new resource has been created',
    accepted: '202-Accepted: The request has been received but not yet acted upon',
  },
  redirect: {
    movedPermanently: '301-MovedPerm: The URI has been moved permanently',
    found: '302-MovedTemp: Found, but the URI has been moved temporarily',
    seeOther: '303-SeeOther: See other. Use another URI with a GET request',
  },
  clientError: {
    badRequest: '400-BadRequest: The server could not understand the request due to invalid syntax',
    unauthorized: '401-Unauthenticated: The client must authenticate itself first',
    forbidden: '403-Forbidden: The client, known to the server, does not have access rights',
    notFound: '404-NotFound: The server can not find requested resource',
    unprocessable: '422-Unprocessable: The request is well formed but has semantic errors',
  },
  serverError: {
    internal: '500-Internal: The server cannot handle this request',
  },
};
