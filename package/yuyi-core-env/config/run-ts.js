const ts = require('ts-node');
const path = require('path');
const fs = require('fs');
const colors = require('colors')

const configPath = path.resolve('tsconfig.json')
const tsconfig = fs.existsSync(configPath) ? configPath : path.join(__dirname, '../tsconfig.json')
console.log(colors.cyan('loading tsconfig file: ') + colors.yellow(tsconfig))
ts.register({
  project: tsconfig,
  typeCheck: false,
  compiler: 'typescript',
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs'
  },
  pretty: false
});