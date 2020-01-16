import gulp from 'gulp';
// import { exec } from 'shelljs'
import { GulpUtils } from './GulpUtils';
import { ScriptsTasks } from './ScriptsTasks';
import { BinTasks } from './BinTasks';
import { TestTasks } from './TestTasks';
// const luaminify = require('gulp-luaminify');

export const watchScripts = GulpUtils.task("scripts:watch", () => {
  return gulp.watch(["src/**/*.lua"], GulpUtils.series([
    ScriptsTasks.pack,
    ScriptsTasks.outputToAulEn
  ]))
});

export const scriptsDev = GulpUtils.task("dev:scripts", GulpUtils.series(
  // BinTasks.pack,
  ScriptsTasks.pack,
  ScriptsTasks.outputToAulEn,
  watchScripts
))

// 默认执行构建
GulpUtils.task("default", GulpUtils.series(
  TestTasks.cls,
  GulpUtils.parallel([BinTasks.pack, ScriptsTasks.pack]),
))
