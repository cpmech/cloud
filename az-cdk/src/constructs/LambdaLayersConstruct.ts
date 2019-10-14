import { Construct } from '@aws-cdk/core';
import { Code, Runtime, LayerVersion, ILayerVersion } from '@aws-cdk/aws-lambda';

export interface ILambdaLayersProps {
  dirLayers?: string; // default = 'layers'
}

export class LambdaLayersConstruct extends Construct {
  readonly layers: ILayerVersion[];

  constructor(scope: Construct, id: string, props?: ILambdaLayersProps) {
    super(scope, id);

    const dirLayers = (props && props.dirLayers) || 'layers';

    const layer = new LayerVersion(this, 'CommonLibs', {
      code: Code.fromAsset(dirLayers),
      compatibleRuntimes: [Runtime.NODEJS_8_10, Runtime.NODEJS_10_X],
      license: 'MIT',
      description: 'Common NodeJS Libraries',
    });

    this.layers = [layer];
  }
}
