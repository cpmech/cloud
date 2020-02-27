import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';

console.log('\n\n## az-envars-cli ########################################');

const cacheRoot = '/tmp/rollup_typescript_cache';

export default [
  {
    input: 'src/index.ts',
    output: {
      banner: '#!/usr/bin/env node\n',
      file: 'dist/index.js',
      format: 'cjs',
    },
    external: [
      'fs',
      'os',
      'path',
      'tty',
      'readline',
      'assert',
      'stream',
      'child_process',
      'crypto',
      'util',
      'buffer',
      'events',
      'string_decoder',
    ],
    plugins: [
      json(),
      typescript({
        cacheRoot,
        typescript: require('typescript'),
        tsconfigOverride: { compilerOptions: { declaration: false } },
      }),
      resolve({ preferBuiltins: true }),
      commonjs(),
      terser(),
    ],
  },
];
