#!/usr/bin/env node
const { Args } = require('@yuyi919/utils/dist/NodeUtils');
const crossEnv = require('cross-env');
const { name: CLI_NAME, description, version } = require('./package.json');
const fs = require('fs-extra');
const path = require('path');

function resolve(target) {
  return path.join(__dirname, target).replace(/\\/g, '/')
}
const args = new Args({
  name: CLI_NAME,
  description,
  version
})
  .addArgument('dir', {})
  .addOption("cwd", {
    defaultValue: process.cwd()
  })
  .addOption('depends', {
    dest: 'depends',
  })


const [options] = args.init()
options.cwd = options.cwd.replace(/\\/g, '/')
const { name: projectName } = require(`${options.cwd}/package.json`)

console.log(CLI_NAME, options)

const cmd = `CWD=${options.cwd} ` +
  `DOC_PROJECT_NAME=${projectName} ` +
  `DOC_MAIN_POINT=${options.dir} ` +
  `DOC_DEPENDS=${options.depends} ` +
  `node ${require.resolve('gulp-awesome/scripts/bin.js')} --gulpfile ${resolve('./config/gulpfile.ts')}`
const cmds = cmd.split(' ')
try {
  console.log(cmd)
  crossEnv(cmds, {})

} catch (error) {
  console.error(error)
  process.exit(0)
}
