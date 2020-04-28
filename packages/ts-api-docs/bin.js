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
const gulp = `yuyi-gulp --gulpfile ${resolve('./config/gulpfile.ts')}`
const main = `yarn --cwd ${__dirname}`

const [options] = args.init()
options.cwd = options.cwd.replace(/\\/g, '/')

const { name: projectName } = require(`${options.cwd}/package.json`)
console.log('yuyi-api-docs', main, options)

// function replacer(config, dir = '<projectFolder>') {
//   config = config.replace(/\$\{projectFolder\}/ig, options.cwd)
//   config = config.replace(/\<projectFolder\>\/dist/ig, `${dir}/${options.dist}`)
//   config = config.replace(/\<projectFolder\>\/etc/ig, `${dir}/${options.etc}`)
//   return config
// }
try {
  // const template = fs.readFileSync(resolve('./config/api-extractor.main.template.json')).toString('utf8');
  // const filePath = resolve(`./.tmp/api/${projectName}/api.json`);
  // if (!fs.existsSync(filePath)) {
  //   fs.createFileSync(filePath);
  // }
  
  // fs.writeFileSync(filePath, replacer(template, resolve(`./.tmp/api/${projectName}`)))
  const script = `cross-env `
    + `CWD=${options.cwd} `
    + `DOC_PROJECT_NAME=${projectName} `
    + `DOC_MAIN_POINT=${options.dir} `
    + `${gulp}` //scripts["api:main"].replace('./config/api-extractor.json', filePath)
  console.log(script)
  const r = shell.exec(script)
  console.log(r.output)
} catch (error) {
  console.error(error)
  process.exit(0)
}
