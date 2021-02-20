import { Construct, Duration } from '@aws-cdk/core';
import { Code, Function, Runtime, ILayerVersion } from '@aws-cdk/aws-lambda';
import { LambdaIntegration, RestApi } from '@aws-cdk/aws-apigateway';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import { PolicyStatement, IRole } from '@aws-cdk/aws-iam';
import { camelize, allFilled, Iany } from '@cpmech/basic';
import { LambdaLayersConstruct, ILayer, commonLayer } from './LambdaLayersConstruct';
import { AuthorizerConstruct } from './AuthorizerConstruct';
import { Route53AliasConstruct } from '../custom-resources/Route53AliasConstruct';
import { addCorsToApiResource } from '../helpers/addCorsToApiResource';
import { defaults } from '../defaults';

export interface ILambdaApiSpec {
  filenameKey: string; // example 'index' (without .js extension)
  handlerName: string; // example 'handler'
  httpMethods: string[]; // example ['GET', 'POST']
  route: string; // example 'hello'
  subroute?: string; // example '{id}'
  unprotected?: boolean; // do not use cognito authorization protection
  extraPermissions?: string[]; // e.g. ['ses:SendEmail']
  accessDynamoTables?: string[]; // names of tables to give access
  accessBuckets?: string[]; // name of buckets to give access
  envars?: Iany; // environmental variables passed to lambda function
  timeout?: Duration; // timeout
  memorySize?: number; // memory size
  runtime?: Runtime; // see defaults.runtime
  dirDist?: string; // default = 'dist'
  layers?: string[]; // name of required layers
  noCommonLayers?: boolean; // will not use commonLayers
}

export interface ICustomApiDomainName {
  prefixedDomain: string; // e.g. api.mydomain.com (may be empty or 'null')
  certificateArn: string; // Arn of an existent and VALID certificate (may be empty or 'null')
  r53HostedZoneId: string; // HostedZoneId of the Route53 zone to set an alias to apiDomain (may be empty or 'null')
  apiRegion?: string; // e.g. us-east-1
}

export interface ILambdaApiProps {
  gatewayName: string; // e.g. 'Myapp'
  lambdas: ILambdaApiSpec[];
  cognitoPoolId?: string; // cognito PoolId for authorization protection. not needed if no route is protected
  customDomain?: ICustomApiDomainName; // ignored if any entry is empty or 'null'
  useLayers?: boolean; // commonLayers. will use default layers
  dirLayers?: string; // commonLayers. default = 'layers'
  specLayers?: ILayer[]; // specific layers
}

export class LambdaApiConstruct extends Construct {
  readonly apiUrl: string;

  constructor(scope: Construct, id: string, props: ILambdaApiProps) {
    super(scope, id);

    const api = new RestApi(this, `${props.gatewayName}`);
    this.apiUrl = api.url;

    if (props.customDomain && allFilled(props.customDomain, ['apiRegion'])) {
      const name = api.addDomainName('ApiDomainName', {
        domainName: props.customDomain.prefixedDomain,
        certificate: Certificate.fromCertificateArn(
          this,
          'ApiCertificate',
          props.customDomain.certificateArn,
        ),
      });

      new Route53AliasConstruct(this, 'Route53Alias', {
        hostedZoneId: props.customDomain.r53HostedZoneId,
        prefixedDomain: props.customDomain.prefixedDomain,
        apiDomainNameAlias: name.domainNameAliasDomainName,
        apiRegion: props.customDomain.apiRegion,
      });
    }

    let authorizer: AuthorizerConstruct;
    if (props.cognitoPoolId) {
      authorizer = new AuthorizerConstruct(this, 'Authorizer', {
        cognitoUserPoolId: props.cognitoPoolId,
        restApiId: api.restApiId,
      });
    }

    let allLayers: LambdaLayersConstruct | undefined;
    if (props.useLayers || props.specLayers) {
      const list: ILayer[] = [];
      if (props.useLayers) {
        list.push(commonLayer);
      }
      if (props.specLayers) {
        list.push(...props.specLayers);
      }
      allLayers = new LambdaLayersConstruct(this, 'Layers', { list });
    }

    props.lambdas.forEach((spec) => {
      if (!spec.unprotected && !props.cognitoPoolId) {
        throw new Error('cognitoPoolId is required for protected routes');
      }

      let layers: ILayerVersion[] | undefined;
      if (allLayers) {
        layers = [];
        if (!spec.noCommonLayers) {
          layers.push(allLayers.name2layer[commonLayer.name]);
        }
        if (spec.layers) {
          for (const name of spec.layers) {
            layers.push(allLayers.name2layer[name]);
          }
        }
      }

      const lambda = new Function(this, camelize(spec.route, true), {
        runtime: spec.runtime || defaults.runtime,
        code: Code.fromAsset(spec.dirDist || 'dist'),
        handler: `${spec.filenameKey}.${spec.handlerName}`,
        environment: spec.envars,
        timeout: spec.timeout,
        memorySize: spec.memorySize,
        layers,
      });

      const integration = new LambdaIntegration(lambda);

      const res = api.root.addResource(spec.route);
      addCorsToApiResource(res, spec.httpMethods);

      if (spec.subroute) {
        const subres = res.addResource(spec.subroute);
        spec.httpMethods.forEach((method) => {
          const m = subres.addMethod(method, integration);
          if (!spec.unprotected) {
            authorizer.protectRoute(m);
          }
        });
      } else {
        spec.httpMethods.forEach((method) => {
          const m = res.addMethod(method, integration);
          if (!spec.unprotected) {
            authorizer.protectRoute(m);
          }
        });
      }

      if (spec.extraPermissions) {
        spec.extraPermissions.forEach((s) => {
          (lambda.role as IRole).addToPrincipalPolicy(
            new PolicyStatement({
              actions: [s],
              resources: ['*'],
            }),
          );
        });
      }

      if (spec.accessDynamoTables) {
        const region = lambda.stack.region;
        spec.accessDynamoTables.forEach((t) => {
          (lambda.role as IRole).addToPrincipalPolicy(
            new PolicyStatement({
              actions: ['dynamodb:*'],
              resources: [
                `arn:aws:dynamodb:${region}:*:table/${t}`,
                `arn:aws:dynamodb:${region}:*:table/${t}/index/*`,
              ],
            }),
          );
        });
      }

      if (spec.accessBuckets) {
        spec.accessBuckets.forEach((b) => {
          (lambda.role as IRole).addToPrincipalPolicy(
            new PolicyStatement({
              actions: ['s3:*'],
              resources: [`arn:aws:s3:::${b}`, `arn:aws:s3:::${b}/*`],
            }),
          );
        });
      }
    });
  }
}
