import AWS from 'aws-sdk';
import { AliasTarget } from 'aws-sdk/clients/route53';
import { waitSettings } from './waitSettings';

export const r53changeRecordSets = async (
  hostedZoneId: string,
  recordSets: AWS.Route53.ResourceRecordSet[],
  action: 'UPSERT' | 'DELETE' = 'UPSERT',
) => {
  // array with changes
  const Changes: AWS.Route53.Change[] = recordSets.map((r) => ({
    Action: action,
    ResourceRecordSet: r,
  }));

  // call Route53
  const r53 = new AWS.Route53();
  const changeBatch = await r53
    .changeResourceRecordSets({
      ChangeBatch: {
        Changes,
      },
      HostedZoneId: hostedZoneId,
    })
    .promise();

  // wait for records to commit
  console.log('--- waiting for r53 records to commit ---');
  await r53.waitFor('resourceRecordSetsChanged', {
    $waiter: waitSettings,
    Id: changeBatch.ChangeInfo.Id,
  });
};

export const r53changeAlias = async (
  hostedZoneId: string, // of the route53 zone
  domainName: string, // e.g. api1-dev.mydomain.com
  alias: AliasTarget, // e.g. { DNSName: 'd-xyz.execute...', HostedZoneId: ..., EvaluateTargetHealth: false }
  action: 'UPSERT' | 'DELETE' = 'UPSERT',
) => {
  await r53changeRecordSets(
    hostedZoneId,
    [
      {
        Name: domainName,
        Type: 'A',
        AliasTarget: alias,
      },
    ],
    action,
  );
};
