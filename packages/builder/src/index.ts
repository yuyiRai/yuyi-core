import { Args } from "@yuyi919/utils/dist/NodeUtils";
const pkg = require('../package.json');

export interface Options {
  pfvFile: string,
  name: string,
  useUpx: boolean,
  nodeVersion: string,
  resource: string,
  icon: string,
  outpath: string;
}
export const options = new Args<Options>({
  version: pkg.version
})
  .addArgument("pfvFile", {})
  .addOption("name", { dest: 'name', help: '主程序名称' })
  .addOption("useUpx", { dest: 'useUpx', action: "storeTrue", help: '启用upx加壳' })
  .addArgument(["-I", "--icon"], {
    dest: 'icon',
    help: '设置图标',
    defaultValue: './assets/icon.res'
  })
  .addOption("resource", { dest: 'resource', action: "append", help: '*嵌入二进制文件中的文件(blob匹配)' })
  // .addArgument(["-a", "--assets"], { dest: 'assets', action: "append", help: '*嵌入二进制文件中的文件(blob匹配)' })
  .addArgument(["-N", "--nodeVersion"], { dest: 'nodeVersion', defaultValue: '6.17.1', help: 'node版本，如：10.15.3, 12.14.0..' })
  .addOption("outpath", { dest: 'outpath' });
