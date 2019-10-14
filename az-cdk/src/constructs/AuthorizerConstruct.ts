import { Aws, Construct } from '@aws-cdk/core';
import { CfnAuthorizer, CfnMethod, Method } from '@aws-cdk/aws-apigateway';

export interface IAuthorizerProps {
  cognitoUserPoolId: string; // cognito user pool Id for authorization protection
  restApiId: string; // ApiGateway Rest API ID
}

export class AuthorizerConstruct extends Construct {
  readonly authorizer: CfnAuthorizer;

  constructor(scope: Construct, id: string, props: IAuthorizerProps) {
    super(scope, id);

    const region = Aws.REGION;
    const account = Aws.ACCOUNT_ID;
    const cognitoArn = `arn:aws:cognito-idp:${region}:${account}:userpool/${props.cognitoUserPoolId}`;

    this.authorizer = new CfnAuthorizer(this, 'Authorizer', {
      name: 'authorizer',
      restApiId: props.restApiId,
      type: 'COGNITO_USER_POOLS',
      identitySource: 'method.request.header.Authorization',
      providerArns: [cognitoArn],
    });
  }

  protectRoute(method: Method) {
    const child = method.node.findChild('Resource') as CfnMethod;
    child.addPropertyOverride('AuthorizationType', 'COGNITO_USER_POOLS');
    child.addPropertyOverride('AuthorizerId', { Ref: this.authorizer.logicalId });
  }
}
