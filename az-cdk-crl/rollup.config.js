import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
// import { terser } from 'rollup-plugin-terser';

const cacheRoot = '/tmp/rollup_typescript_cache';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
    },
  ],
  external: ['aws-sdk'],
  plugins: [
    typescript({
      cacheRoot,
      typescript: require('typescript'),
    }),
    resolve({
      mainFields: ['module'],
    }),
    // terser()
  ],
};
