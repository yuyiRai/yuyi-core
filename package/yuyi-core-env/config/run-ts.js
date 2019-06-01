const ts = require('ts-node');
const path = require('path');

ts.register({
  project: path.resolve('tsconfig.json'),
  typeCheck: false,
  compiler: 'typescript',
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs'
  },
  pretty: false
});