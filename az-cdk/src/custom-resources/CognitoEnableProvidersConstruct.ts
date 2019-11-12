import { Construct, Duration } from '@aws-cdk/core';
import { Function, Code, Runtime } from '@aws-cdk/aws-lambda';
import { CustomResource, CustomResourceProvider } from '@aws-cdk/aws-cloudformation';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { crlDir } from './crlDir';

export interface ICognitoEnableProvidersProps {
  userPoolId: string;
  userPoolClientId: string;
  providers: string[];
  callbackUrls?: string[];
  logoutUrls?: string[];
}

export class CognitoEnableProvidersConstruct extends Construct {
  constructor(scope: Construct, id: string, props: ICognitoEnableProvidersProps) {
    super(scope, id);

    const fcn = new Function(this, 'Function', {
      code: Code.asset(crlDir),
      handler: 'index.cognitoEnableProviders',
      runtime: Runtime.NODEJS_10_X,
      timeout: Duration.minutes(1),
    });

    fcn.addToRolePolicy(
      new PolicyStatement({
        actions: ['cognito-idp:*'],
        resources: ['*'],
      }),
    );

    const cbUrls = props.callbackUrls ? props.callbackUrls : ['https://localhost:3000/'];
    const lgUrls = props.logoutUrls ? props.logoutUrls : ['https://localhost:3000/'];

    new CustomResource(this, 'Resource', {
      provider: CustomResourceProvider.lambda(fcn),
      properties: {
        UserPoolId: props.userPoolId,
        UserPoolClientId: props.userPoolClientId,
        Providers: props.providers,
        CallbackUrls: cbUrls,
        LogoutUrls: lgUrls,
      },
    });
  }
}
