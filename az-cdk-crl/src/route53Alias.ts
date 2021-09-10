import { hasProp } from '@cpmech/basic';
import { report } from './util/report';
import { AliasTarget } from 'aws-sdk/clients/route53';
import { r53changeAlias } from './util/r53Tools';

// route53Alias sets route53 (internal) alias
//
// INPUT:
//   event.ResourceProperties {
//     HostedZoneId: string;
//     DomainName: string;
//     TheAliasTarget: AliasTarget
//   }
//
// EXAMPLE:
//   TheAliasTarget = {
//     DNSName: 'd-xyz.execute-api.us-east-1.amazonaws.com',
//     HostedZoneId: apiGatewayHostedZoneId(region),
//     EvaluateTargetHealth: false,
//   }
//
// OUTPUT:
//   The PhysicalResourceId will be equal to the domain name
//
export const route53Alias = async (event: any, context: any) => {
  try {
    // check input
    if (!hasProp(event.ResourceProperties, 'HostedZoneId')) {
      throw new Error(`ResourceProperties must have HostedZoneId prop`);
    }
    if (!hasProp(event.ResourceProperties, 'DomainName')) {
      throw new Error(`ResourceProperties must have DomainName prop`);
    }
    if (!hasProp(event.ResourceProperties, 'TheAliasTarget')) {
      throw new Error(`ResourceProperties must have TheAliasTarget prop`);
    }

    // extract input
    const { HostedZoneId, DomainName, TheAliasTarget } = event.ResourceProperties;

    // check input again
    if (!hasProp(TheAliasTarget, 'DNSName')) {
      throw new Error(`TheAliasTarget must have DNSName prop`);
    }
    if (!hasProp(TheAliasTarget, 'HostedZoneId')) {
      throw new Error(`TheAliasTarget must have HostedZoneId prop`);
    }
    if (!hasProp(TheAliasTarget, 'EvaluateTargetHealth')) {
      throw new Error(`TheAliasTarget must have EvaluateTargetHealth prop`);
    }

    // prepare alias target data structure
    const alias: AliasTarget = {
      DNSName: TheAliasTarget.DNSName,
      HostedZoneId: TheAliasTarget.HostedZoneId,
      EvaluateTargetHealth: TheAliasTarget.EvaluateTargetHealth === 'true',
    };

    // set the physical resource Id
    let resourceId = DomainName;

    // handle request
    switch (event.RequestType) {
      case 'Create':
        console.log('..... creating alias ......');
        await r53changeAlias(HostedZoneId, DomainName, alias);
        break;

      case 'Update':
        console.log('..... updating alias ......');
        await r53changeAlias(HostedZoneId, DomainName, alias);
        break;

      case 'Delete':
        console.log('..... deleting alias ......');
        await r53changeAlias(HostedZoneId, DomainName, alias, 'DELETE');
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
