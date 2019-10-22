#!/usr/bin/env node
"use strict";
var ts = require('ts-node');
var path = require('path');
var fs = require('fs');
var colors = require('colors')

var configPath = path.resolve('tsconfig.json')
var tsconfig = fs.existsSync(configPath) ? configPath : path.join(__dirname, '../tsconfig.json')
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

// console.log(process.cwd(), process.argv, process.argv[2])
require(path.join(process.cwd(), './scripts/cli'))