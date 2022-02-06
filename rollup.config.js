import { terser } from 'rollup-plugin-terser'
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'lib/index.ts',
  output: [
    {
      file: 'dist/visitor-counter.cjs.js',
      format: 'cjs',
      exports: 'auto',
    },
    {
      file: 'dist/visitor-counter.esm.mjs',
      format: 'es',
    },
  ],
  external: ['crypto', 'mongodb', 'fast-geoip'],
  plugins: [typescript(), terser()],
}
