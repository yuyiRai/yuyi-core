import gulp from 'gulp';
import shell from 'gulp-shell';
import luapack from 'gulp-luapack';
import rename from 'gulp-rename';
import { GulpUtils, Pipes } from './GulpUtils';
import { logger } from '@yuyi919/gulp-awesome';

export namespace BinTasks {
  export const importStatic = GulpUtils.task("static:bin", () => {
    return gulp.src(["./static/bin/**/*"])
      .pipe(gulp.dest("./build/bin"));
  });
  export const build = GulpUtils.task("build:main", () => {
    return gulp.src(["./src/main.lua"])
      .pipe(luapack())
      .pipe(rename((path: any) => ({ ...path, extname: ".wlua" })))
      .pipe(gulp.dest("lib"))
      // .pipe(shell("ts-node ./scripts/build.ts main.lua"))
      .pipe(Pipes.logSource2Target())
      .pipe(GulpUtils.shell(`glue "%LUA_DIST%\\wsrlua.exe" lib/main.lua build/bin/main.exe`))
      .pipe(Pipes.logSource2Target("Building"));
  });

  export const pack = GulpUtils.task("build:bin", GulpUtils.series([
    // 把构建完毕的脚本和obj文件输出到build目录下,
    importStatic,
    // 先构建lua脚本
    build
  ]));
}
