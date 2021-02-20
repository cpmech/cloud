import { Construct, Duration } from '@aws-cdk/core';
import { Function, Code, Runtime } from '@aws-cdk/aws-lambda';
import { CustomResource, CustomResourceProvider } from '@aws-cdk/aws-cloudformation';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { crlDir } from './crlDir';
import { defaults } from '../defaults';

export interface ICognitoPoolDomainProps {
  userPoolId: string;
  domainPrefix: string;
  runtime?: Runtime; // see defaults.runtime
}

export class CognitoPoolDomainConstruct extends Construct {
  constructor(scope: Construct, id: string, props: ICognitoPoolDomainProps) {
    super(scope, id);

    const fcn = new Function(this, 'Function', {
      code: Code.fromAsset(crlDir),
      handler: 'index.cognitoPoolDomain',
      runtime: props.runtime || defaults.runtime,
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
