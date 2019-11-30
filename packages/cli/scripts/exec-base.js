#!/usr/bin/env node
"use strict";
var ts = require('ts-node');
var path = require('path');
var fs = require('fs-extra');
var colors = require('colors')

var configPath = path.resolve('tsconfig.json')
var tsconfig = fs.pathExistsSync(configPath) ? configPath : path.join(__dirname, '../tsconfig.json')
console.log(colors.cyan('loading tsconfig file: ') + colors.yellow(tsconfig))
exports.install = function (compiler) {
  ts.register({
    project: tsconfig,
    typeCheck: false,
    compiler: compiler,
    transpileOnly: true,
    compilerOptions: {
      module: 'commonjs'
    },
    ignore: [
      'node_modules/(?!@yuyi919/cli)'
    ],
    pretty: false
  });
}
