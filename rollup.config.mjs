// rollup.config.mjs
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
//

export default {
  input: 'main.js',
  output: {
    file: './dist/content.js',
    name: 'content',
    format: 'iife'
  },
  plugins: [
    resolve(),
    commonjs(),
    copy({
      targets: [{src: 'extensions/*', dest: 'dist'}]
    })
  ]
};
