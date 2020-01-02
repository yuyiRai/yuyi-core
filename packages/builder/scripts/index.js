#!/usr/bin/env node
const shelljs = require("shelljs")
const path = require('path')
const args = require('argparse')
const fs = require('fs-extra')
const build = path.join(__dirname, "../bin/upx-3.95-win64/upx.exe")
const options = new args.ArgumentParser({})
options.addArgument("inputFile", {})
options.addArgument(["-n", "--name"], { dest: 'name', help: '主程序名称' })
options.addArgument(["-u", "--upx"], { dest: 'useUpx', action: "storeTrue", help: '启用upx加壳' })
options.addArgument(["-r", "--resource"], { dest: 'resource', action: "append", help: '*嵌入二进制文件中的文件(blob匹配)' })
options.addArgument(["-a", "--assets"], { dest: 'assets', action: "append", help: '*嵌入二进制文件中的文件(blob匹配)' })
options.addArgument(["-v", "--version"], { dest: 'version', defaultValue: '6.17.1', help: 'node版本，如：10.15.3, 12.14.0..' })
options.addArgument(["-o", "--outpath"], { dest: 'outpath' })

const extendsArray = (name, r) => r && r.map(r => `-${name} ${r}`).join(' ') || ''
const exec = shell => {
  console.log(shell)
  return shelljs.exec(shell, { })
}
const getPackageName = (defaultName) => {
  const hasPackage = path.resolve('./package.json')
  const name = hasPackage && fs.existsSync(hasPackage) && fs.readJSONSync(hasPackage).name.split('/')
  return name && (name.length > 1 ? name[name.length - 1] : name[0]) || defaultName
}
const [o] = options.parseKnownArgs()
const input = path.resolve(o.inputFile)
let current = input
const inputFileName = path.parse(current).name
console.log("input: " + current)
if (path.extname(current) === '.js') {
  const tmp = "./node_modules/.cache/upx_build/tmp.exe"
  exec(`nexe -t win32-x64-${o.version} -i ${current} ${extendsArray('r', o.resource)} ${o.name && `--name ${o.name}` || ''} -o ${tmp}`)
  current = tmp
  console.log("set tmp: " + path.resolve(current))
}
const outpath = o.outpath
  && path.resolve(o.outpath)
  || path.join(
    process.cwd(),
    (o.name || getPackageName(inputFileName)) + '.exe'
  )
console.log("output: " + outpath)
fs.existsSync(outpath) && (fs.removeSync(outpath))
const bin = path.join(__dirname, "../bin/resource_hacker/ResourceHacker.exe")
// // 删除资源信息
// // console.log(c)
exec(`${bin} -open ${current} -save ${current} -action delete -mask "ICONGROUP,,"`)
exec(`${bin} -open ${current} -save ${current} -action add -res C:\\AVIUTL\\AVIUTL_EN\\aviutl.exe`)
// // upx加壳
if (o.useUpx) {
  exec(`${build} --best -o ${outpath} ${current}`)
} else {
  fs.moveSync(current, outpath)
}

if (current !== input) {
  fs.removeSync(current)
}
