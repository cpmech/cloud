import typescript from 'rollup-plugin-typescript2';

console.log('\n\n## az-cdk ###############################################');

const cacheRoot = '/tmp/rollup_typescript_cache';

const config = ['cjs', 'esm'].map(format => {
  return {
    input: {
      index: 'src/index.ts',
    },
    output: [
      {
        dir: `dist/${format}`,
        format,
      },
    ],
    external: [
      '@aws-cdk/core',
      '@aws-cdk/aws-apigateway',
      '@aws-cdk/aws-s3',
      '@aws-cdk/aws-cognito',
      '@aws-cdk/aws-lambda',
      '@aws-cdk/aws-iam',
      '@aws-cdk/aws-dynamodb',
      '@aws-cdk/aws-certificatemanager',
      '@aws-cdk/aws-sns',
      '@aws-cdk/aws-events',
      '@aws-cdk/aws-events-targets',
      '@aws-cdk/aws-sns-subscriptions',
      '@aws-cdk/aws-sqs',
      '@aws-cdk/aws-route53',
      '@aws-cdk/aws-route53-targets',
      '@aws-cdk/aws-cloudfront',
      '@aws-cdk/aws-cloudformation',
      '@aws-cdk/aws-codepipeline',
      '@aws-cdk/aws-codebuild',
      '@aws-cdk/aws-codepipeline-actions',
      '@cpmech/basic',
    ],
    plugins: [
      typescript({
        cacheRoot,
        typescript: require('typescript'),
        tsconfigOverride: { compilerOptions: { declaration: format === 'esm' } },
      }),
    ],
  };
});

export default config;
