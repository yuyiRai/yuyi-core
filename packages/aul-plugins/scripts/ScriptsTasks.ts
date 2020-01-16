import gulp from 'gulp';
import rename from 'gulp-rename';
import replace from 'gulp-replace'
import luapack from 'gulp-luapack';
import { GulpUtils } from './GulpUtils';
// const luaminify = require('gulp-luaminify');
const convertEncoding = require('gulp-convert-encoding');

const { logger } = GulpUtils;
export namespace ScriptsTasks {

  export const importStatic = GulpUtils.task("static:scripts", () => {
    return gulp.src(["./static/scripts/**/*"])
      .pipe(gulp.dest("./build/scripts"));
  });
  export function createBuildTask(name: string, ...path: string[]) {
    return GulpUtils.task(name, () => {
      return gulp.src([...path])
        // .pipe(luaminify())
        .pipe(luapack())
        .pipe(gulp.dest("lib"))
        .pipe(logger.output("'${sourcePath}' => '${path}'"))
        .pipe(GulpUtils.shell`luac -s -o ${file => file.path}c ${file => file.path}`)
        // .pipe(shell("ts-node ./scripts/build.ts TrpgScript/TextPanel.lua,YuyiCore.lua"))
        .pipe(logger.output("'${sourcePath}' => '${path}c'"));
    });
  }

  export const build = createBuildTask("build:lib", "src/**/TextPanel.lua", "src/**/TachieLib.lua", "src/**/YuyiCore.lua");

  export const packLib = GulpUtils.task("lib2build", () => {
    return gulp.src(["lib/**/*.luac"], { ignore: ["lib/main.luac"] })
      .pipe(rename((path: any) => ({ ...path, extname: ".lua" })))
      .pipe(gulp.dest("build/scripts"))
      .pipe(logger("移动scripts")("'${sourcePath}' => '${path}'"));
  });

  export const packObj = GulpUtils.task("obj2build", () => {
    return gulp.src(["src/**/*.obj", "src/**/*.anm", "src/**/*.anm.lua", "src/**/*.obj.lua"])
      .pipe(replace(/----@/g, '@'))
      // 创建临时文件
      .pipe(rename((path: any) => {
        console.log(path)
        return /\.(obj|anm)/.test(path.basename) ? ({ ...path, extname: "" }) : path
      }))
      .pipe(convertEncoding({ from: 'utf-8', to: 'Shift-JIS' }))
      .pipe(logger("编码转换为Shift-JIS")` source: '${file => file.path}'`)
      .pipe(gulp.dest("build/scripts"))
      .pipe(logger("移动.Obj文件")("'${sourcePath}' => '${path}'"));
  });

  export const packScripts = GulpUtils.task("scripts2Build", GulpUtils.parallel(packLib, packObj, importStatic));

  export const pack = GulpUtils.task("build:script", GulpUtils.series([
    // 先构建lua脚本
    build,
    // 把构建完毕的脚本和obj文件输出到build目录下
    packScripts
  ]));
  
  export const outputToAulEn = GulpUtils.task("将构建输出到英文版aviutl目录", () => {
    return gulp.src(["build/scripts/**"]).pipe(gulp.dest("C:\\AVIUTL\\AVIUTL_EN\\Script"));
  });
}
