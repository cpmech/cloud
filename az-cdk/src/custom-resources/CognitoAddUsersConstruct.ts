import { Construct, Duration } from '@aws-cdk/core';
import { Function, Code, Runtime } from '@aws-cdk/aws-lambda';
import { CustomResource, CustomResourceProvider } from '@aws-cdk/aws-cloudformation';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { IUserInput } from '@cpmech/az-cognito';
import { crlDir } from './crlDir';

export interface ICognitoAddUsersProps {
  userPoolId: string;
  userPoolClientId: string;
  users: IUserInput[];
}

export class CognitoAddUsersConstruct extends Construct {
  constructor(scope: Construct, id: string, props: ICognitoAddUsersProps) {
    super(scope, id);

    const fcn = new Function(this, 'Function', {
      code: Code.asset(crlDir),
      handler: 'index.cognitoAddUsers',
      runtime: Runtime.NODEJS_10_X,
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
        UserPoolClientId: props.userPoolClientId,
        Users: props.users,
      },
    });
  }
}
