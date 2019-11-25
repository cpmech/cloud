import { Construct, Duration } from '@aws-cdk/core';
import { Function, Code, Runtime } from '@aws-cdk/aws-lambda';
import { CustomResource, CustomResourceProvider } from '@aws-cdk/aws-cloudformation';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { crlDir } from './crlDir';

export interface ICognitoPoolDomainProps {
  userPoolId: string;
  domainPrefix: string;
}

export class CognitoPoolDomainConstruct extends Construct {
  constructor(scope: Construct, id: string, props: ICognitoPoolDomainProps) {
    super(scope, id);

    const fcn = new Function(this, 'Function', {
      code: Code.asset(crlDir),
      handler: 'index.cognitoPoolDomain',
      runtime: Runtime.NODEJS_12_X,
      timeout: Duration.minutes(1),
    });

    fcn.addToRolePolicy(
      new PolicyStatement({
        actions: ['cognito-idp:*'],
        resources: ['*'],
      }),
    );

    new CustomResource(this, 'Resource', {
      provider: CustomResourceProvider.lambda(fcn),
      properties: {
        UserPoolId: props.userPoolId,
        DomainPrefix: props.domainPrefix,
      },
    });
  }
}
