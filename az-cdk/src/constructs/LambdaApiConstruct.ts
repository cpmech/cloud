import { Construct } from '@aws-cdk/core';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { LambdaIntegration, RestApi } from '@aws-cdk/aws-apigateway';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import { PolicyStatement, IRole } from '@aws-cdk/aws-iam';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';
import { camelize, allFilled, hasProp } from '@cpmech/basic';
import { LambdaLayersConstruct } from './LambdaLayersConstruct';
import { AuthorizerConstruct } from './AuthorizerConstruct';
import { Route53AliasConstruct } from '../custom-resources/Route53AliasConstruct';
import { addCorsToApiResource } from '../helpers/addCorsToApiResource';

export interface ILambdaApiSpec {
  filenameKey: string; // example 'index' (without .js extension)
  handlerName: string; // example 'handler'
  httpMethods: string[]; // example ['GET', 'POST']
  route: string; // example 'hello'
  subroute?: string; // example '{id}'
  unprotected?: boolean; // do not use cognito authorization protection
  extraPermissions?: string[]; // e.g. ['ses:SendEmail']
  accessDynamoTables?: string[]; // names of tables to give access (tables defined in dynamoTableNames)
}

export interface ICustomApiDomainName {
  prefixedDomain: string; // e.g. api.mydomain.com (may be empty or 'null')
  certificateArn: string; // Arn of an existent and VALID certificate (may be empty or 'null')
  r53HostedZoneId: string; // HostedZoneId of the Route53 zone to set an alias to apiDomain (may be empty or 'null')
  apiRegion?: string; // e.g. us-east-1
}

export interface IDynamoTable {
  name: string; // name of table
  partitionKey: string; // name of partiton key (the value will be string)
  sortKey?: string; // name of sort key (the value will be string)
}

export interface ILambdaApiProps {
  gatewayName: string; // e.g. 'Myapp'
  lambdas: ILambdaApiSpec[];
  cognitoId?: string; // cognito Id for authorization protection. not needed if no route is protected
  layers?: LambdaLayersConstruct; // lambda layers with common libs
  customDomain?: ICustomApiDomainName; // ignored if any entry is empty or 'null'
  dirDist?: string; // default = 'dist'
  dynamoTables?: IDynamoTable[]; // create some DynamoDB tables (give access to functions using accessDynamoTables)
}

export class LambdaApiConstruct extends Construct {
  readonly apiUrl: string;

  constructor(scope: Construct, id: string, props: ILambdaApiProps) {
    super(scope, id);

    const dirDist = props.dirDist || 'dist';

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
    if (props.cognitoId) {
      authorizer = new AuthorizerConstruct(this, 'Authorizer', {
        cognitoUserPoolId: props.cognitoId,
        restApiId: api.restApiId,
      });
    }

    const name2table: { [tableName: string]: Table } = {};
    if (props.dynamoTables) {
      props.dynamoTables.forEach((t, i) => {
        const table = new Table(this, `Table${i}`, {
          tableName: t.name,
          partitionKey: { name: t.partitionKey, type: AttributeType.STRING },
          sortKey: t.sortKey ? { name: t.sortKey, type: AttributeType.STRING } : undefined,
        });
        name2table[t.name] = table;
      });
    }

    props.lambdas.forEach(spec => {
      if (!spec.unprotected && !props.cognitoId) {
        throw new Error('cognitoId is required for protected routes');
      }

      const lambda = new Function(this, camelize(spec.route, true), {
        runtime: Runtime.NODEJS_10_X,
        code: Code.fromAsset(dirDist),
        handler: `${spec.filenameKey}.${spec.handlerName}`,
        layers: props.layers ? props.layers.layers : undefined,
      });

      const integration = new LambdaIntegration(lambda);

      const res = api.root.addResource(spec.route);
      addCorsToApiResource(res, spec.httpMethods);

      if (spec.subroute) {
        const subres = res.addResource(spec.subroute);
        spec.httpMethods.forEach(method => {
          const m = subres.addMethod(method, integration);
          if (!spec.unprotected) {
            authorizer.protectRoute(m);
          }
        });
      } else {
        spec.httpMethods.forEach(method => {
          const m = res.addMethod(method, integration);
          if (!spec.unprotected) {
            authorizer.protectRoute(m);
          }
        });
      }

      if (spec.extraPermissions) {
        spec.extraPermissions.forEach(s => {
          (lambda.role as IRole).addToPolicy(
            new PolicyStatement({
              actions: [s],
              resources: ['*'],
            }),
          );
        });
      }

      if (spec.accessDynamoTables) {
        spec.accessDynamoTables.forEach(tableName => {
          if (hasProp(name2table, tableName)) {
            name2table[tableName].grantReadWriteData(lambda);
          }
        });
      }
    });
  }
}
