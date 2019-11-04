import { Construct } from '@aws-cdk/core';
import {
  UserPool,
  SignInType,
  UserPoolAttribute,
  CfnUserPool,
  UserPoolClient,
} from '@aws-cdk/aws-cognito';

// example of customAttribute:
//   {
//     attributeDataType: 'String',
//     name: 'custom:accessGroup',
//     mutable: true,
//     required: true,
//   },

export interface ICognitoProps {
  poolName: string;
  emailSendingAccount: string;
  customAttributes?: CfnUserPool.SchemaAttributeProperty[];
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
      cfn.schema = props.customAttributes;
    }
  }
}
