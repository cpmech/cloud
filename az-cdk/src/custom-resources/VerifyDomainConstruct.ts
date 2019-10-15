import { Construct, Duration } from '@aws-cdk/core';
import { Function, Code, Runtime } from '@aws-cdk/aws-lambda';
import { CustomResource, CustomResourceProvider } from '@aws-cdk/aws-cloudformation';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { crlDir } from './crlDir';

export interface IVerifyDomainProps {
  hostedZoneId: string;
  domain: string;
  certificateArn?: string;
}

export class VerifyDomainConstruct extends Construct {
  constructor(scope: Construct, id: string, props: IVerifyDomainProps) {
    super(scope, id);

    const certificateArn = props.certificateArn || 'null';

    const fcn = new Function(this, 'Function', {
      code: Code.asset(crlDir),
      handler: 'index.verifyDomain',
      runtime: Runtime.NODEJS_8_10,
      timeout: Duration.minutes(1),
    });

    const sesActions = [
      'acm:DescribeCertificate',
      'ses:VerifyDomainIdentity',
      'ses:VerifyDomainDkim',
      'ses:GetIdentityVerificationAttributes',
      'ses:GetIdentityDkimAttributes',
      'ses:DeleteIdentity',
    ];

    const r53Actions = ['route53:ChangeResourceRecordSets', 'route53:GetChange'];

    sesActions.forEach(action => {
      fcn.addToRolePolicy(
        new PolicyStatement({
          actions: [action],
          resources: ['*'],
        }),
      );
    });

    r53Actions.forEach(action => {
      fcn.addToRolePolicy(
        new PolicyStatement({
          actions: [action],
          resources: [`arn:aws:route53:::hostedzone/${props.hostedZoneId}`],
        }),
      );
    });

    new CustomResource(this, 'Resource', {
      provider: CustomResourceProvider.lambda(fcn),
      properties: {
        HostedZoneId: props.hostedZoneId,
        DomainName: props.domain,
        CertificateArn: certificateArn,
      },
    });
  }
}
