import { Construct } from '@aws-cdk/core';
import { PublicHostedZone, MxRecord, IPublicHostedZone } from '@aws-cdk/aws-route53';
import { VerifyDomainConstruct } from '../custom-resources/VerifyDomainConstruct';

export interface IRoute53RecvEmailProps {
  domain: string; // e.g. mydomain.com
  comment?: string; // e.g. My awesome domain
  hostedZoneId?: string; // use an existend hosted zone, otherwise create a new (public) one
  certificateArn?: string; // Arn of an existent and VALID certificate. Use empty or 'null' to skip use of certificate
}

export class Route53RecvEmailConstruct extends Construct {
  constructor(scope: Construct, id: string, props: IRoute53RecvEmailProps) {
    super(scope, id);

    const certificateArn = props.certificateArn || 'null';

    let zone: IPublicHostedZone;
    if (props.hostedZoneId) {
      zone = PublicHostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
        hostedZoneId: props.hostedZoneId,
        zoneName: props.domain,
      });
    } else {
      zone = new PublicHostedZone(this, 'HostedZone', {
        zoneName: props.domain,
        comment: props.comment,
        caaAmazon: true,
      });
    }

    new MxRecord(this, 'MX', {
      zone,
      values: [
        {
          priority: 10,
          hostName: `inbound-smtp.${zone.stack.region}.amazonaws.com`,
        },
      ],
    });

    new VerifyDomainConstruct(this, 'VerifyDomain', {
      hostedZoneId: zone.hostedZoneId,
      domain: props.domain,
      certificateArn,
    });
  }
}
