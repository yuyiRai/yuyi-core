import { Args } from '@yuyi919/utils/dist/NodeUtils';
import { resolve } from './resolve';
const { name: CLI_NAME, description = CLI_NAME, version } = require('../package.json');

export function cli() {
  const crossEnv = require('cross-env');
  const path = require('path');
  function resolve(target) {
    return path.join(__dirname, '..', target).replace(/\\/g, '/');
  }
  const args = getCliOptions();
  const [options] = args.init();
  options.cwd = options.cwd.replace(/\\/g, '/');
  const { name: projectName } = require(`${options.cwd}/package.json`);
  console.log(options);
  const cmd = `CWD=${options.cwd} ` +
    `DOC_PROJECT_NAME=${projectName} ` +
    `DOC_MAIN_POINT=${options.dir} ` +
    `DOC_DEPENDS=${options.depends} ` +
    `DOC_ACTION_TYPE=${options.mode} ` +
    `node ${resolve('../gulp-awesome/scripts/bin.js')} ` +
    `--gulpfile ${
    //resolve('./config/gulpfile.ts')
    resolve(process.env.NODE_ENV !== 'development' ? './gulpfile.js' : './test/gulpfile.ts')}`;
  const cmds = cmd.split(' ');
  try {
    console.log(cmd);
    crossEnv(cmds, {});
  }
  catch (error) {
    console.error(error);
    process.exit(0);
  }
}
export interface CliOptions {
  /** *.d.ts目录 */
  dir: string;
  /** 项目根目录 */
  cwd: string;
  /** 输出模式 */
  mode: "html" | "serve" | "docfx" | "md";
  /** 依赖捆绑（数组） */
  depends: string;
  /** 启动的服务端口 */
  port: string;
}
export function getCliOptions() {
  return new Args<CliOptions>({
    description,
    version
  })
    .addArgument('dir', {})
    .addOption("cwd", {
      defaultValue: process.cwd()
    })
    .addOption("mode", {
      defaultValue: "docfx",
      choices: ["html", "serve", "docfx", "md"],
      help: '默认=docfx'
    })
    .addOption('depends', {
      dest: 'depends',
    })
    .addOption('port', {
      dest: 'port',
    });
}
