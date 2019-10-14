import { Construct } from '@aws-cdk/core';
import { UserPool, SignInType, UserPoolAttribute, CfnUserPool } from '@aws-cdk/aws-cognito';

export interface ICognitoProps {
  poolName: string;
  emailSendingAccount: string;
}

export class CognitoConstruct extends Construct {
  readonly poolId: string;

  constructor(scope: Construct, id: string, props: ICognitoProps) {
    super(scope, id);

    const pool = new UserPool(this, 'Pool', {
      userPoolName: props.poolName,
      signInType: SignInType.EMAIL,
      autoVerifiedAttributes: [UserPoolAttribute.EMAIL],
    });

    this.poolId = pool.userPoolId;

    const region = pool.stack.region;
    const accountId = pool.stack.account;

    const cfn = pool.node.findChild('Resource') as CfnUserPool;

    cfn.emailConfiguration = {
      emailSendingAccount: 'DEVELOPER',
      sourceArn: `arn:aws:ses:${region}:${accountId}:identity/${props.emailSendingAccount}`,
    };
  }
}
