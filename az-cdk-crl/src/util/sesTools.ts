import AWS from 'aws-sdk';
import { hasProp } from '@cpmech/basic';
import { waitSettings } from './waitSettings';

const sesTXTrecordSet = (domainName: string, token: string): AWS.Route53.ResourceRecordSet => ({
  Name: `_amazonses.${domainName}`,
  Type: 'TXT',
  TTL: 1800,
  ResourceRecords: [{ Value: `"${token}"` }],
});

const sesDKIMrecordSet = (domainName: string, token: string): AWS.Route53.ResourceRecordSet => ({
  Name: `${token}._domainkey.${domainName}`,
  Type: 'CNAME',
  TTL: 1800,
  ResourceRecords: [{ Value: `${token}.dkim.amazonses.com` }],
});

export const sesDispatchVerifyIdentityAndDkim = async (
  domainName: string,
): Promise<AWS.Route53.ResourceRecordSet[]> => {
  // verify domain and DKIM
  const ses = new AWS.SES();
  const r1 = await ses.verifyDomainIdentity({ Domain: domainName }).promise();
  const r2 = await ses.verifyDomainDkim({ Domain: domainName }).promise();

  // results
  return [
    sesTXTrecordSet(domainName, r1.VerificationToken),
    ...r2.DkimTokens.map((t) => sesDKIMrecordSet(domainName, t)),
  ];
};

export const sesDescribeVerifyIdentityAndDkim = async (
  domainName: string,
): Promise<AWS.Route53.ResourceRecordSet[]> => {
  // get identity and DKIM tokens
  const ses = new AWS.SES();
  const r1 = await ses.getIdentityVerificationAttributes({ Identities: [domainName] }).promise();
  const r2 = await ses.getIdentityDkimAttributes({ Identities: [domainName] }).promise();

  // data to return
  const recordSets: AWS.Route53.ResourceRecordSet[] = [];

  // collect identity token
  if (hasProp(r1.VerificationAttributes, domainName)) {
    const attr = r1.VerificationAttributes[domainName];
    if (attr.VerificationToken) {
      recordSets.push(sesTXTrecordSet(domainName, attr.VerificationToken));
    }
  }

  // collect DKIM tokens
  if (hasProp(r2.DkimAttributes, domainName)) {
    const attr = r2.DkimAttributes[domainName];
    if (attr.DkimTokens) {
      attr.DkimTokens.forEach((t) => recordSets.push(sesDKIMrecordSet(domainName, t)));
    }
  }

  // results
  return recordSets;
};

export const sesWaitForIdentity = async (domainName: string) => {
  const ses = new AWS.SES();
  console.log('--- waiting for ses verification ---');
  await ses
    .waitFor('identityExists', {
      $waiter: waitSettings,
      Identities: [domainName],
    })
    .promise();
};

export const sesDeleteIdentity = async (domainName: string) => {
  const ses = new AWS.SES();
  await ses.deleteIdentity({ Identity: domainName }).promise();
};
