import { Construct } from '@aws-cdk/core';
import { Code, Runtime, LayerVersion, ILayerVersion } from '@aws-cdk/aws-lambda';

export interface ILambdaLayerSpec {
  name: string;
  description?: string;
  runtime?: Runtime; // default = NODEJS_12_X
  dirLayer?: string; // default = 'dist'
  license?: string; // default = MIT
}

export interface ILambdaLayersProps {
  layers?: ILambdaLayerSpec[]; // default = [{runtime:NODEJS_12_X, dirLayer:'layers'}]
}

export class LambdaLayersConstruct extends Construct {
  readonly all: ILayerVersion[] = [];

  constructor(scope: Construct, id: string, props?: ILambdaLayersProps) {
    super(scope, id);

    const defaultRuntime = Runtime.NODEJS_12_X;
    const defaultDirLayer = 'layers';
    const defaultLicense = 'MIT';

    let specs: ILambdaLayerSpec[] = [
      {
        name: 'CommonLibs',
        description: 'Common NodeJS Libraries',
        runtime: defaultRuntime,
        dirLayer: defaultDirLayer,
        license: defaultLicense,
      },
    ];
    if (props && props.layers && props.layers.length > 0) {
      specs = props.layers;
    }

    specs.forEach(spec => {
      const layer = new LayerVersion(this, spec.name, {
        code: Code.fromAsset(spec.dirLayer || defaultDirLayer),
        compatibleRuntimes: [spec.runtime || defaultRuntime],
        description: spec.description || 'Common Libraries',
        license: spec.license || defaultLicense,
      });
      this.all.push(layer);
    });
  }
}
