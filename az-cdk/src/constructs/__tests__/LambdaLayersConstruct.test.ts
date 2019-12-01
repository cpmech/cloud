import { App, Stack } from '@aws-cdk/core';
import { LambdaLayersConstruct } from '../LambdaLayersConstruct';
import { synthAppString } from '../../helpers/synthApp';

describe('LambdaLayersConstruct', () => {
  it('synthetizes properly', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new LambdaLayersConstruct(stack, 'Layers', {
      layers: [
        {
          name: 'CommonLibs',
          dirLayer: 'src/constructs/__tests__/lambda-layers',
        },
      ],
    });
    expect(synthAppString(app)).toMatchSnapshot();
  });
});
