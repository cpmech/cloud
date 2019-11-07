import { Construct } from '@aws-cdk/core';
import {
  UserPool,
  SignInType,
  UserPoolAttribute,
  CfnUserPool,
  UserPoolClient,
  UserPoolTriggers,
} from '@aws-cdk/aws-cognito';

export interface ICognitoProps {
  poolName: string;
  emailSendingAccount: string;
  customAttributes?: string[]; // string, and mutable. NOTE: do not prefix with custom
  lambdaTriggers?: UserPoolTriggers;
}

export class CognitoConstruct extends Construct {
  readonly poolId: string;
  readonly clientId: string;

  constructor(scope: Construct, id: string, props: ICognitoProps) {
    super(scope, id);

    const pool = new UserPool(this, 'Pool', {
      userPoolName: props.poolName,
      signInType: SignInType.EMAIL,
      autoVerifiedAttributes: [UserPoolAttribute.EMAIL],
      lambdaTriggers: props.lambdaTriggers,
    });

    const client = new UserPoolClient(this, 'PoolCient', {
      userPoolClientName: `${props.poolName}-client`,
      userPool: pool,
    });

    this.poolId = pool.userPoolId;
    this.clientId = client.userPoolClientId;

    const region = pool.stack.region;
    const accountId = pool.stack.account;

    const cfn = pool.node.findChild('Resource') as CfnUserPool;

    cfn.emailConfiguration = {
      emailSendingAccount: 'DEVELOPER',
      sourceArn: `arn:aws:ses:${region}:${accountId}:identity/${props.emailSendingAccount}`,
    };

    if (props.customAttributes) {
      cfn.schema = props.customAttributes.map(name => ({
        attributeDataType: 'String',
        mutable: true,
        name,
      }));
    }
  }
}
