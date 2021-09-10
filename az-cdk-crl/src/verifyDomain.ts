import AWS from 'aws-sdk';
import { hasProp } from '@cpmech/basic';
import { report } from './util/report';
import {
  sesDispatchVerifyIdentityAndDkim,
  sesDescribeVerifyIdentityAndDkim,
  sesWaitForIdentity,
  sesDeleteIdentity,
} from './util/sesTools';
import { r53changeRecordSets } from './util/r53Tools';

const verifyDomainHandler = async (
  hostedZoneId: string,
  domainName: string,
  certificateArn: string,
) => {
  const acm = new AWS.ACM();
  const res = await acm.describeCertificate({ CertificateArn: certificateArn }).promise();
  if (res.Certificate) {
    if (res.Certificate.Status === 'ISSUED') {
      const recordSets = await sesDispatchVerifyIdentityAndDkim(domainName);
      await r53changeRecordSets(hostedZoneId, recordSets);
      await sesWaitForIdentity(domainName);
      return;
    }
  }
  console.log('[WARNING] cannot verify domain because certificate has not been issued yet');
  return;
};

const verifyDomainCleaner = async (hostedZoneId: string, domainName: string) => {
  const recordSets = await sesDescribeVerifyIdentityAndDkim(domainName);
  await r53changeRecordSets(hostedZoneId, recordSets, 'DELETE');
  await sesDeleteIdentity(domainName);
  return;
};

// verifyDomain configures SES and Route53 to verify domain
//
// INPUT:
//   event.ResourceProperties {
//     HostedZoneId: string;
//     DomainName: string;
//     CertificateArn: string;
//   }
//
// OUTPUT:
//   The PhysicalResourceId will be equal to the domain name
//
export const verifyDomain = async (event: any, context: any) => {
  try {
    // check input
    if (!hasProp(event.ResourceProperties, 'HostedZoneId')) {
      throw new Error(`ResourceProperties must have "HostedZoneId" prop`);
    }
    if (!hasProp(event.ResourceProperties, 'DomainName')) {
      throw new Error(`ResourceProperties must have "DomainName" prop`);
    }
    if (!hasProp(event.ResourceProperties, 'CertificateArn')) {
      throw new Error(`ResourceProperties must have "CertificateArn" prop`);
    }

    // extract input
    const { HostedZoneId, DomainName, CertificateArn } = event.ResourceProperties;

    // the physical resource Id will be set with the SES token
    let resourceId = DomainName;

    // handle request
    switch (event.RequestType) {
      case 'Create':
        console.log('..... verifying domain and setting route53 ......');
        await verifyDomainHandler(HostedZoneId, DomainName, CertificateArn);
        break;

      case 'Update':
        console.log('..... verifying domain and setting route53 ......');
        await verifyDomainHandler(HostedZoneId, DomainName, CertificateArn);
        break;

      case 'Delete':
        console.log('..... deleting verify-domain data ......');
        await verifyDomainCleaner(HostedZoneId, DomainName);
        resourceId = event.PhysicalResourceId;
        break;

      default:
        throw new Error(`unsupported request type ${event.RequestType}`);
    }

    // return SUCCESS message
    const responseData = {};
    await report(event, context, 'SUCCESS', resourceId, responseData);
    //
    // handle errors
  } catch (err) {
    await report(event, context, 'FAILED', '', null, `${err}`);
  }
};
