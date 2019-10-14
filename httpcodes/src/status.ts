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
