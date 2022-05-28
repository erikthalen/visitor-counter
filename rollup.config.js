import { terser } from 'rollup-plugin-terser'
import htmlparts from 'rollup-plugin-htmlparts'
import inline from 'rollup-plugin-inline-js'

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
  external: ['crypto', 'mongodb', 'fast-geoip', 'url', 'fs', 'path'],
  plugins: [
    inline('lib/ui.js'), // inline ui.js into ui.html
    htmlparts('lib/ui.html'), // inline ui.html into index.mjs
    terser(),
  ],
}
