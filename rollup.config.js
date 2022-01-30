import { terser } from 'rollup-plugin-terser'

export default {
  input: 'lib/index.mjs',
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
  plugins: [terser()],
}
