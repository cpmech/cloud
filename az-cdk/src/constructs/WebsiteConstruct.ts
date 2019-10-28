import { Aws, Construct, RemovalPolicy } from '@aws-cdk/core';
import {
  PublicHostedZone,
  ARecord,
  AaaaRecord,
  MxRecord,
  RecordTarget,
  IPublicHostedZone,
} from '@aws-cdk/aws-route53';
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets';
import { Bucket } from '@aws-cdk/aws-s3';
import { CloudFrontWebDistribution, PriceClass, AliasConfiguration } from '@aws-cdk/aws-cloudfront';
import { VerifyDomainConstruct } from '../custom-resources/VerifyDomainConstruct';

export interface IWebsiteProps {
  domain: string; // e.g. mydomain.com
  prefix?: string; // e.g. 'app' for deploying app.mydomain.com ('www' will not be created then)
  skipMX?: boolean; // skip setting MX record set
  skipVerification?: boolean; // skip domain verificaton
  comment?: string; // e.g. My awesome domain
  hostedZoneId?: string; // use an existend hosted zone, otherwise create a new (public) one
  certificateArn?: string; // Arn of an existent and VALID certificate. Use empty or 'null' to skip use of certificate
  errorCodes?: number[]; // default = 403, 404
  errorRoute?: string; // default = /index.html
}

// Website creates bucket, cloudformation, certificate, and route53 data for a website
export class WebsiteConstruct extends Construct {
  readonly cloudfrontDistributionId: string;

  constructor(scope: Construct, id: string, props: IWebsiteProps) {
    super(scope, id);

    const certificateArn = props.certificateArn || 'null';
    const prefixedDomain = `${props.prefix ? props.prefix + '.' : ''}${props.domain}`;
    const errorCodes = props.errorCodes || [403, 404];
    const errorRoute = props.errorRoute || '/index.html';

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

    const bucket = new Bucket(this, 'Bucket', {
      bucketName: `${prefixedDomain}-${id.toLowerCase()}`,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    let aliasConfiguration: AliasConfiguration | undefined;
    if (certificateArn !== 'null') {
      aliasConfiguration = {
        acmCertRef: certificateArn,
        names: [prefixedDomain],
      };
      if (!props.prefix) {
        aliasConfiguration.names.push(`www.${props.domain}`);
      }
    }

    const distribution = new CloudFrontWebDistribution(this, 'Distribution', {
      aliasConfiguration,
      defaultRootObject: undefined,
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
          },
          behaviors: [
            {
              isDefaultBehavior: true,
            },
          ],
        },
      ],
      priceClass: PriceClass.PRICE_CLASS_ALL,
      errorConfigurations: errorCodes.map(code => ({
        errorCachingMinTtl: 300,
        errorCode: code,
        responseCode: 200,
        responsePagePath: errorRoute,
      })),
    });

    this.cloudfrontDistributionId = distribution.distributionId;

    const target = new CloudFrontTarget(distribution);

    // prefixed
    if (props.prefix) {
      new ARecord(this, 'A', {
        zone,
        recordName: props.prefix,
        target: RecordTarget.fromAlias(target),
      });

      new AaaaRecord(this, 'AAA', {
        zone,
        recordName: props.prefix,
        target: RecordTarget.fromAlias(target),
      });

      // standard
    } else {
      new ARecord(this, 'A', {
        zone,
        target: RecordTarget.fromAlias(target),
      });

      new AaaaRecord(this, 'AAAA', {
        zone,
        target: RecordTarget.fromAlias(target),
      });

      new ARecord(this, 'WWW', {
        zone,
        recordName: 'www',
        target: RecordTarget.fromAlias(target),
      });

      if (!props.skipMX) {
        new MxRecord(this, 'MX', {
          zone,
          values: [
            {
              priority: 10,
              hostName: `inbound-smtp.${Aws.REGION}.amazonaws.com`,
            },
          ],
        });
      }

      if (!props.skipVerification) {
        new VerifyDomainConstruct(this, 'VerifyDomain', {
          hostedZoneId: zone.hostedZoneId,
          domain: props.domain,
          certificateArn,
        });
      }
    }
  }
}
