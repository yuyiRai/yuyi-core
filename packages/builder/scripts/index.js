#!/usr/bin/env node
const { shell } = require("@yuyi919/shell-exec-awesome")
const path = require('path')
const fs = require('fs-extra')
const upxBin = path.join(__dirname, "../bin/upx-3.95-win64/upx.exe")

const { options } = require("../dist")

const extendsArray = (name, r) => r && r.map(r => `-${name} ${r}`).join(' ') || ''
const exec = (cmd) => {
  return shell.exec(cmd)
}
const getPackageName = (defaultName) => {
  const hasPackage = path.resolve('./package.json')
  const name = hasPackage && fs.existsSync(hasPackage) && fs.readJSONSync(hasPackage).name.split('/')
  return name && (name.length > 1 ? name[name.length - 1] : name[0]) || defaultName
}
const [o] = options.init()
const input = path.resolve(o.pfvFile)
let current = input
const inputFileName = path.parse(current).name
console.log("input: " + current)
if (path.extname(current) === '.js') {
  const tmp = "./node_modules/.cache/upx_build/tmp.exe"
  exec(`nexe -t win32-x64-${o.nodeVersion} -i ${current} ${extendsArray('r', o.resource && o.resource.concat(['assets/**/*']))} ${o.name && `--name ${o.name}` || ''} -o ${tmp}`)
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
const resourceHackerBin = path.join(__dirname, "../bin/resource_hacker/ResourceHacker.exe")
// // 删除资源信息
// // console.log(c)
const icon = fs.existsSync(path.resolve(o.icon)) && o.icon || 'C:\\AVIUTL\\AVIUTL_EN\\aviutl.exe'
exec(`${resourceHackerBin} -open ${current} -save ${current} -action delete -mask *,,`)
exec(`${resourceHackerBin} -open ${current} -save ${current} -action addoverwrite -res ${icon} -mask *,,`)
// // upx加壳
if (o.useUpx) {
  exec(`${upxBin} --best -o ${outpath} ${current}`)
} else {
  fs.moveSync(current, outpath)
}

if (current !== input) {
  fs.removeSync(current)
}
