import { Construct, Duration } from '@aws-cdk/core';
import { Code, Function, Runtime, ILayerVersion, LayerVersion } from '@aws-cdk/aws-lambda';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { Iany } from '@cpmech/basic';

export interface ILambdaProps {
  filenameKey: string; // example 'index' (without .js extension)
  handlerName: string; // example 'handler'
  envars?: Iany; // environmental variables passed to lambda function
  timeout?: Duration; // timeout
  memorySize?: number; // memory size
  runtime?: Runtime; // default = NODEJS_12_X
  dirDist?: string; // default = 'dist'
  layerArns?: string[]; // ARNs of needed layers
  extraPermissions?: string[]; // e.g. ['ses:SendEmail']
  accessDynamoTables?: string[]; // names of tables to give access
  accessBuckets?: string[]; // name of buckets to give access
}

export class LambdaConstruct extends Construct {
  readonly functionName: string;
  readonly functionArn: string;

  constructor(scope: Construct, id: string, props: ILambdaProps) {
    super(scope, id);

    let layers: ILayerVersion[] | undefined;
    if (props.layerArns) {
      layers = props.layerArns.map((arn) => LayerVersion.fromLayerVersionArn(this, 'Layer', arn));
    }

    const lambda = new Function(this, 'Lambda', {
      runtime: props.runtime || Runtime.NODEJS_12_X,
      code: Code.fromAsset(props.dirDist || 'dist'),
      handler: `${props.filenameKey}.${props.handlerName}`,
      layers,
      environment: props.envars,
      timeout: props.timeout,
      memorySize: props.memorySize,
    });

    this.functionName = lambda.functionName;
    this.functionArn = lambda.functionArn;

    if (props.extraPermissions) {
      props.extraPermissions.forEach((s) => {
        lambda.role?.addToPrincipalPolicy(
          new PolicyStatement({
            actions: [s],
            resources: ['*'],
          }),
        );
      });
    }

    if (props.accessDynamoTables) {
      const region = lambda.stack.region;
      props.accessDynamoTables.forEach((t) => {
        lambda.role?.addToPrincipalPolicy(
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

    if (props.accessBuckets) {
      props.accessBuckets.forEach((b) => {
        lambda.role?.addToPrincipalPolicy(
          new PolicyStatement({
            actions: ['s3:*'],
            resources: [`arn:aws:s3:::${b}`, `arn:aws:s3:::${b}/*`],
          }),
        );
      });
    }
  }
}
