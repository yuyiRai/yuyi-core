import fs from 'fs-extra'
import * as gulp from 'gulp'
import { logger, shell } from '@yuyi919/gulp-awesome'
// import shell from 'gulp-shell';
import path from 'path';
import { resolve, paths, requireResolve, resolveTmpDir } from './resolve';
const { CWD, DOC_PROJECT_NAME: projectName, DOC_MAIN_POINT } = process.env

const folder = fs.readdirSync(
  resolve('./src', true)
).filter(name => fs.pathExistsSync(
  resolve(`./src/${name}/index.ts`, true)
))

const mainTemplate = fs.readFileSync(paths.mainTemplate).toString('utf8');
const template = fs.readFileSync(paths.template).toString('utf8')

if (!fs.pathExistsSync('./etc')) {
  fs.mkdirSync('./etc')
}

const requiredMainPoint = requireResolve(DOC_MAIN_POINT)
export function createMainApiTask() {
  function replacer(template: string, dir = '<projectFolder>') {
    template = template.replace(/\$\{projectFolder\}/ig, CWD);
    template = template.replace(/\<projectFolder\>\/lib\/index.d.ts/ig, requiredMainPoint);
    template = template.replace(/\<projectFolder\>\/dist/ig, `${dir}/${process.env.dist || 'dist'}`);
    template = template.replace(/\<projectFolder\>\/etc/ig, `${dir}/${process.env.etc || 'etc'}`);
    template = template.replace(/\<projectFolder\>/ig, dir);
    return template;
  }
  return function () {
    const filePath = resolveTmpDir(`index.api.json`);
    if (!fs.existsSync(filePath)) {
      fs.createFileSync(filePath);
    }
    fs.writeFileSync(filePath, replacer(mainTemplate, paths.tmpProjectDir));
    return gulp.src(filePath)
      .pipe(logger.log('project_name: ' + process.env.DOC_PROJECT_NAME))
      .pipe(shell(`api-extractor run -c ${filePath} --local --verbose`))
  }
}


export function createApiTask(folderName?: string) {
  const filePath = resolveTmpDir(`${folderName}.api.json`);
  function replacer(template: string, dir = '<projectFolder>') {
    template = template.replace(/\$\{projectFolder\}/ig, CWD);
    template = template.replace(/\<projectFolder\>\/lib/ig, path.parse(requiredMainPoint).dir);
    template = template.replace(/\<projectFolder\>\/dist/ig, `${dir}/${process.env.dist || 'dist'}`);
    template = template.replace(/\<projectFolder\>\/etc/ig, `${dir}/${process.env.etc || 'etc'}`);
    template = template.replace(/\<projectFolder\>/ig, dir);
    template = template.replace(/\$\{folderName\}/ig, folderName);
    return template;
  }
  return function () {
    if (!fs.existsSync(filePath)) {
      fs.createFileSync(filePath)
    }
    fs.writeFileSync(filePath, replacer(template, paths.tmpProjectDir))
    return gulp.src(filePath).pipe(shell(`api-extractor run -c ${filePath} --local --verbose`))
  }
}

export default function () {
  const list = folder.map(folderName => createApiTask(folderName));
  // console.log('folder', list);
  return gulp.parallel(list)
}
