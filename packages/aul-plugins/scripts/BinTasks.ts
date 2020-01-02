import gulp from 'gulp';
import shell from 'gulp-shell';
import luapack from 'gulp-luapack';
import { GulpUtils } from './GulpUtils';
import { logger } from './logger';
export namespace BinTasks {
  export const importStatic = GulpUtils.task("static:bin", () => {
    return gulp.src(["./static/bin/**/*"])
      .pipe(gulp.dest("./build/bin"));
  });
  export const build = GulpUtils.task("build:main", () => {
    return gulp.src(["./src/main.lua"])
      .pipe(luapack())
      .pipe(gulp.dest("lib"))
      // .pipe(shell("ts-node ./scripts/build.ts main.lua"))
      .pipe(logger.output("'${sourcePath}' => '${path}'"))
      .pipe(shell("ciuplua lib/main.lua build/bin/main.exe"))
      .pipe(logger("Building")("'${sourcePath}' => '${path}'"));
  });
  export const pack = GulpUtils.task("build:bin", GulpUtils.parallel(build, importStatic));
}
