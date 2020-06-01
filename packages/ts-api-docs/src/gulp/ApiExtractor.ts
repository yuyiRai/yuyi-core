import fs from 'fs-extra';
import * as gulp from 'gulp';
import { sleep } from '@yuyi919/utils';
import { logger, shell, task } from '@yuyi919/gulp-awesome';
// import shell from 'gulp-shell';
import path from 'path';
import { CWD, DOC_MAIN_POINT, depends, resolve, paths, requireResolve, resolveTmpDir } from '../resolve';

const DOC_MAIN_DIR = path.parse(DOC_MAIN_POINT).ext ? path.dirname(DOC_MAIN_POINT) : path.basename(DOC_MAIN_POINT)
/** 模块目录收集 */
const folders = fs.readdirSync(
  resolve(DOC_MAIN_DIR, true)
).filter(name => fs.pathExistsSync(
  resolve(path.join('.', DOC_MAIN_DIR, `${name}/index.d.ts`), true)
));
console.log(DOC_MAIN_DIR, folders)
const mainTemplate = fs.readFileSync(paths.mainTemplate).toString('utf8');
const template = fs.readFileSync(paths.template).toString('utf8');

if (!fs.pathExistsSync(paths.tmpEtcDir)) {
  fs.ensureDirSync(paths.tmpEtcDir);
}

const requiredMainPoint = requireResolve(DOC_MAIN_POINT);
/**
 * 模板绑定
 * @param template index.d.ts模板
 * @param dir 输出目录
 */
function replacer(template: string, dir = '<projectFolder>') {
  // 依赖打包
  template = template.replace(/\$\{depends\}/ig, depends.join("\",\""))
  // 项目根目录
  template = template.replace(/\$\{projectFolder\}/ig, CWD);
  // *.d.ts汇总入口文件
  template = template.replace(/\<projectFolder\>\/lib\/index.d.ts/ig, requiredMainPoint);
  // *.d.ts汇总输出目录
  template = template.replace(/\<projectFolder\>\/dist/ig, `${dir}/dist`);
  // api-extractor输出目录
  template = template.replace(/\<projectFolder\>\/etc/ig, `${dir}/etc`);
  template = template.replace(/\<projectFolder\>/ig, dir);
  return template;
}
export function createMainApiTask() {
  return function () {
    const filePath = resolveTmpDir(`index.api.json`);
    if (!fs.existsSync(filePath)) {
      fs.createFileSync(filePath);
    }
    fs.writeFileSync(filePath, replacer(mainTemplate, paths.tmpProjectDir));
    console.debug('project_name: ' + process.env.DOC_PROJECT_NAME);
    return gulp.src(filePath)
      .pipe(logger.log('project_name: ' + process.env.DOC_PROJECT_NAME))
      .pipe(shell(`api-extractor run -c ${filePath} --local`));
  };
}


export function createApiTask(folderName?: string) {
  const filePath = resolveTmpDir(`${folderName}.api.json`);
  /**
   * 树模板绑定
   * @param template 树分支模板
   * @param dir 输出目录
   */
  function replacer(template: string, dir = '<projectFolder>') {
    // 依赖打包
    template = template.replace(/\$\{depends\}/ig, depends.join("\",\""))
    // 项目根目录
    template = template.replace(/\$\{projectFolder\}/ig, CWD);
    // *.d.ts汇总入口文件
    template = template.replace(/\<projectFolder\>\/lib/ig, path.parse(requiredMainPoint).dir);
    // *.d.ts汇总输出目录
    template = template.replace(/\<projectFolder\>\/dist/ig, `${dir}/dist`);
    // api-extractor输出目录
    template = template.replace(/\<projectFolder\>\/etc/ig, `${dir}/etc`);
    template = template.replace(/\<projectFolder\>/ig, dir);
    // 模块目录
    template = template.replace(/\$\{folderName\}/ig, folderName);
    return template;
  }
  return function () {
    if (!fs.existsSync(filePath)) {
      fs.createFileSync(filePath);
    }
    fs.writeFileSync(filePath, replacer(template, paths.tmpProjectDir));
    return gulp.src(filePath)
      .pipe(logger.log('Project Tree Api: ' + folderName))
      .pipe(shell(`api-extractor run -c ${filePath} --local`));
  };
}

export function createDependApiTask(moduleName: string, dtsPath: string) {
  const filePath = resolveTmpDir(`${moduleName}.api.json`);
  /**
   * 依赖包的模板绑定
   * @param template 树分支模板
   * @param dir 输出目录
   */
  function replacer(template: string, dir = '<projectFolder>') {
    // 项目根目录
    template = template.replace(/\$\{projectFolder\}/ig, CWD);
    // *.d.ts汇总入口文件
    console.error(dtsPath);
    template = template.replace(/\<projectFolder\>\/lib\/\$\{folderName\}\/index.d.ts/ig, dtsPath);
    // *.d.ts汇总输出目录
    template = template.replace(/\<projectFolder\>\/dist/ig, `${dir}/dist`);
    // api-extractor输出目录
    template = template.replace(/\<projectFolder\>\/etc/ig, `${dir}/etc`);
    template = template.replace(/\<projectFolder\>/ig, dir);
    // 模块目录
    template = template.replace(/\$\{folderName\}/ig, moduleName);
    return template;
  }
  return function () {
    if (!fs.existsSync(filePath)) {
      fs.createFileSync(filePath);
    }
    fs.writeFileSync(filePath, replacer(template, paths.tmpProjectDir));
    return gulp.src(filePath)
      .pipe(logger.log('Project Depends Api: ' + moduleName))
      .pipe(shell(`api-extractor run -c ${filePath} --local`));
  };
}

export const getEmptyTask = (msg: string) => task(
  'empty',
  async () => {
    await sleep(100);
    return gulp.src('.', { read: false }).pipe(logger.log(msg));
  }
);

export default function () {
  if (folders.length === 0) {
    return createMainApiTask();
  }
  const list = folders.map(createApiTask);
  // console.log('folder', list);
  return gulp.parallel(list);
}
