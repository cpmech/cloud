import { IResource, MockIntegration, PassthroughBehavior } from '@aws-cdk/aws-apigateway';

export const addCorsToApiResource = (
  resource: IResource,
  methods: string[] = ['GET', 'PUT', 'POST', 'DELETE'],
) => {
  const m = methods.join(',');
  resource.addMethod(
    'OPTIONS',
    new MockIntegration({
      integrationResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Headers': `'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'`,
            'method.response.header.Access-Control-Allow-Origin': `'*'`,
            'method.response.header.Access-Control-Allow-Credentials': `'false'`,
            'method.response.header.Access-Control-Allow-Methods': `'OPTIONS,${m}'`,
          },
        },
      ],
      passthroughBehavior: PassthroughBehavior.NEVER,
      requestTemplates: {
        'application/json': '{"statusCode": 200}',
      },
    }),
    {
      methodResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Methods': true,
            'method.response.header.Access-Control-Allow-Credentials': true,
            'method.response.header.Access-Control-Allow-Origin': true,
          },
        },
      ],
    },
  );
};
