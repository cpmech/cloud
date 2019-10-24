import { Construct, Duration } from '@aws-cdk/core';
import { Function, Code, Runtime } from '@aws-cdk/aws-lambda';
import { CustomResource, CustomResourceProvider } from '@aws-cdk/aws-cloudformation';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { AliasTarget } from 'aws-sdk/clients/route53';
import { apiGatewayHostedZoneId } from '../helpers/apiGatewayHostedZoneId';
import { crlDir } from './crlDir';

export interface IRoute53AliasProps {
  hostedZoneId: string;
  prefixedDomain: string; // e.g. 'api1-dev.mydomain.com'
  apiDomainNameAlias: string; // from RestApi.DomainName
  apiRegion?: string; // default = us-east-1
}

export class Route53AliasConstruct extends Construct {
  constructor(scope: Construct, id: string, props: IRoute53AliasProps) {
    super(scope, id);

    const fcn = new Function(this, 'Function', {
      code: Code.asset(crlDir),
      handler: 'index.route53Alias',
      runtime: Runtime.NODEJS_10_X,
      timeout: Duration.minutes(1),
    });

    const actions = ['route53:ChangeResourceRecordSets', 'route53:GetChange'];

    actions.forEach(action => {
      fcn.addToRolePolicy(
        new PolicyStatement({
          actions: [action],
          resources: [`arn:aws:route53:::hostedzone/${props.hostedZoneId}`],
        }),
      );
    });

    const region = props.apiRegion || 'us-east-1';

    const aliasTarget: AliasTarget = {
      DNSName: props.apiDomainNameAlias,
      HostedZoneId: apiGatewayHostedZoneId(region),
      EvaluateTargetHealth: false,
    };

    new CustomResource(this, 'Resource', {
      provider: CustomResourceProvider.lambda(fcn),
      properties: {
        HostedZoneId: props.hostedZoneId,
        DomainName: props.prefixedDomain,
        TheAliasTarget: aliasTarget,
      },
    });
  }
}
