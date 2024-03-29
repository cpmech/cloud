import { APIGatewayProxyEvent, APIGatewayEventRequestContext } from 'aws-lambda';

export const zeroEventRequestContext: APIGatewayEventRequestContext = {
  accountId: '',
  apiId: '',
  authorizer: null,
  connectedAt: 0,
  connectionId: '',
  domainName: '',
  eventType: '',
  extendedRequestId: '',
  protocol: '',
  httpMethod: '',
  identity: {
    accessKey: null,
    accountId: null,
    apiKey: null,
    apiKeyId: null,
    caller: null,
    clientCert: null,
    cognitoAuthenticationProvider: null,
    cognitoAuthenticationType: null,
    cognitoIdentityId: null,
    cognitoIdentityPoolId: null,
    principalOrgId: null,
    sourceIp: '',
    user: null,
    userAgent: null,
    userArn: null,
  },
  messageDirection: '',
  messageId: null,
  path: '',
  stage: '',
  requestId: '',
  requestTime: '',
  requestTimeEpoch: 0,
  resourceId: '',
  resourcePath: '',
  routeKey: '',
};

export const zeroEvent: APIGatewayProxyEvent = {
  body: null,
  headers: {},
  multiValueHeaders: {},
  httpMethod: '',
  isBase64Encoded: false,
  path: '',
  pathParameters: null,
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: zeroEventRequestContext,
  resource: '',
};
