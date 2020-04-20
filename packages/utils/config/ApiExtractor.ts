import fs from 'fs-extra'
import * as gulp from 'gulp'
import shell from 'gulp-shell'
import { isObject, unset, set, isEqual, pick, escapeRegExp } from 'lodash'
import jeditor from 'gulp-json-editor'
import JSON5 from 'json5'

const folder = fs.readdirSync('./src').filter(name => fs.pathExistsSync(`./src/${name}/index.ts`))
console.log(folder)
const template = fs.readFileSync('./config/api-extractor.template.json').toString('utf8')

if (!fs.pathExistsSync('./etc')) {
  fs.mkdirSync('./etc')
}


export function createApiTask(folderName?: string) {
  const tmpFileName = folderName + ".api.json"
  const filePath = './config/tmp/' + tmpFileName
  return function () {
    console.log('task', folderName, `api-extractor run -c ${filePath} --local --verbose`)
    if (!fs.existsSync(filePath)) {
      fs.createFileSync(filePath)
    }
    fs.writeFileSync(filePath, template.replace(/\$\{folderName\}/ig, folderName))
    return gulp.src(filePath).pipe(shell([`api-extractor run -c ${filePath} --local --verbose`]))
  }
}

export default function () {
  const list = folder.map(folderName => createApiTask(folderName));
  // console.log('folder', list);
  return gulp.parallel(list)
}
