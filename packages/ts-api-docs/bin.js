#!/usr/bin/env node
const { Args } = require('@yuyi919/utils/dist/NodeUtils');
const { shell } = require('@yuyi919/shell-exec-awesome')
const { execSync } = require('child_process')
const { name: CLI_NAME, scripts } = require('./package.json')
const fs = require('fs-extra')
const path = require('path')

function resolve(target) {
  return path.join(__dirname, target).replace(/\\/g, '/')
}
const args = new Args({

})
  .addArgument('dir', {})
  .addOption(["--cwd"], {
    defaultValue: process.cwd()
  })
  .addOption(['-d', '--distFolderName'], {
    dest: 'dist',
    defaultValue: 'dist'
  })
  .addOption(['-r', '--reportFolderName'], {
    dest: 'etc',
    defaultValue: 'etc'
  })


const [options] = args.init()
options.cwd = options.cwd.replace(/\\/g, '/')
const { name: projectName } = require(`${options.cwd}/package.json`)
console.log('yuyi-api-docs', options)


const gulp = `cross-env `
  + `CWD=${options.cwd} `
  + `DOC_PROJECT_NAME=${projectName} `
  + `DOC_MAIN_POINT=${options.dir} `
  + `yuyi-gulp --gulpfile ${resolve('./config/gulpfile.ts')}`
  
try {
  const script = `${gulp}`
  console.log(script)
  const r = shell.exec(script)
  console.log(r.output)
} catch (error) {
  console.error(error)
  process.exit(0)
}
