import { Construct } from '@aws-cdk/core';
import { Code, Runtime, LayerVersion, ILayerVersion } from '@aws-cdk/aws-lambda';
import { defaults } from '../defaults';

export interface ILayer {
  name: string;
  arn?: string; // will use existent layer and ignore the other options
  description?: string;
  runtime?: Runtime; // see defaults.runtime
  dirLayer?: string;
  license?: string;
}

export interface ILambdaLayersProps {
  list?: ILayer[];
}

const defaultDescription = 'Common NodeJS Libraries';
const defaultDirLayer = 'layers';
const defaultLicense = 'MIT';

export const commonLayer: ILayer = {
  name: 'CommonLibs',
  description: defaultDescription,
  runtime: defaults.runtime,
  dirLayer: defaultDirLayer,
  license: defaultLicense,
};

export class LambdaLayersConstruct extends Construct {
  readonly all: ILayerVersion[] = [];
  readonly name2layer: { [name: string]: ILayerVersion } = {};

  constructor(scope: Construct, id: string, props?: ILambdaLayersProps) {
    super(scope, id);

    const specs: ILayer[] =
      props && props.list && props.list.length > 0 ? props.list : [commonLayer];

    specs.forEach((spec) => {
      let layer: ILayerVersion;
      if (spec.arn) {
        layer = LayerVersion.fromLayerVersionArn(this, spec.name, spec.arn);
      } else {
        layer = new LayerVersion(this, spec.name, {
          code: Code.fromAsset(spec.dirLayer || defaultDirLayer),
          compatibleRuntimes: [spec.runtime || defaults.runtime],
          description: spec.description || defaultDescription,
          license: spec.license || defaultLicense,
        });
      }
      this.all.push(layer);
      this.name2layer[spec.name] = layer;
    });
  }
}
