#!/usr/bin/env node
'use strict';

const colors = require('colors')
const path = require('path')
const args = process.argv.filter(i => i.indexOf('\\shelljs') === -1)
if (args.length === 2) {
  args.push('-h')
}

// const cmd = `gulp --require @yuyi919/env/config/run-ts.js --cwd . ${args.join(' ')}`
process.argv = args.concat(["--require", require.resolve("@yuyi919/env/config/run-ts.js"), "--cwd", process.cwd()])
// console.log(process.argv)
console.log("gulp " + process.argv.slice(2).map(
  (arg, i, arr) => i + 4 >= arr.length ? colors.cyan(arg) : arg
).join(' '))

require("gulp-cli")()
