const ts = require('ts-node');
const path = require('path');
const fs = require('fs');

const configPath = path.resolve('tsconfig.json')

ts.register({
  project: fs.existsSync(configPath) && configPath,
  typeCheck: false,
  compiler: 'typescript',
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs'
  },
  pretty: false
});