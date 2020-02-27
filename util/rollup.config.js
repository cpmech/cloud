import typescript from 'rollup-plugin-typescript2';

console.log('\n\n## util #################################################');

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
    external: ['@cpmech/basic'],
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
