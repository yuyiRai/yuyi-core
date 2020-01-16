import gulp from 'gulp';
import path from 'path';
import rename from 'gulp-rename';
import { GulpUtils, Tasks, Pipes } from './GulpUtils';
// import { exec } from 'shelljs'
import { ScriptsTasks } from './ScriptsTasks';
const convertEncoding = require('gulp-convert-encoding');
// const sourceCHCP = /([0-9]+)/.exec(exec("CHCP", { silent: false }).stdout)[1]
// console.log("CHCP ", sourceCHCP)
const clear = () => process.stdout.write(process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H')

// clear()

const { logger } = GulpUtils;
export namespace TestTasks {
  const Series = GulpUtils.series;

  export const setEvnJp = Tasks.CHCP(Tasks.CHCP_CODE.shiftjis);
  export const cls = GulpUtils.task("清屏", "cls");

  export const cleanTmpfiles = GulpUtils.task("test:clean_tmp", "rimraf test/__tests__");
  // export const resetCHCP = GulpUtils.task("test:clean_tmp", "CHCP " + sourceCHCP);

  export const execTest = GulpUtils.task("test:exec", () => {
    return gulp.src(["test/**/*.lua"], { ignore: ["test/__tests__/**/*.lua.tmp"] })
      // 测试时以Shift-JIS编码环境进行
      .pipe(Pipes.encoding("Shift-JIS", 'utf-8'))
      // 创建临时文件
      .pipe(rename((path: any) => ({ ...path, extname: ".lua.tmp" })))
      .pipe(gulp.dest("test/__tests__"))
      .pipe(logger("为测试创建临时文件")` path: '${file => file.path}'`)
      // 执行测试的临时文件
      .pipe(GulpUtils.shell`lua ${file => file.path}`);
  });


  const execTestAndClean: GulpUtils.TaskHandler[] = [cls, execTest, cleanTmpfiles]

  export const test = GulpUtils.task("test", Series(setEvnJp, execTestAndClean));

  export const execWatch = GulpUtils.task("test:watch_exec", () => {
    const instance = gulp.watch(["src/**/*.lua", "test/**/*.lua"]);
    // console.log(w.eventNames())
    instance.addListener("change", async (filePath) => {
      const handleTasks = [...execTestAndClean]
      clear()
      if (typeof filePath === 'string' && filePath.indexOf("src" + path.sep) > -1) {
        console.log(`${filePath} changed`);
        handleTasks.unshift(ScriptsTasks.createBuildTask("build:" + filePath, filePath));
      }
      const handle = Series(...handleTasks);
      await handle(error => {
        // console.log('finished', filePath);
      });
    });
    return instance;
  });

  export const testWatch = GulpUtils.task("test:watch", Series(test, execWatch));
}
