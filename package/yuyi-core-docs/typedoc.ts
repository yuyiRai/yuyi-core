
import { paths, relativePaths } from "yuyi-core-env/config/paths";
import { reduce } from 'lodash'

const excludePlugins = ['typedoc-plugin-folder-modules', 'typedoc-plugin-npm-externals']

const pkg = require('./package.json')
const pluginList = reduce(pkg.devDependencies, (list, v, key) => {
  return key.indexOf('typedoc-plugin') === 0 && !excludePlugins.includes(key) ? list.concat([key]) : list
}, [])
export function getExecStr() {
  const paramData = {
    // typedoc样式配置
    "theme": relativePaths.typedocTheme,
    // typedoc配置文件
    "options": relativePaths.typedocConfig,
    "plugin": pluginList.join(','),
    "preferred-example-language": "javascript",
    // 根据路径配置模块展示
    "external-modulemap": `".*\/src\/((.*?Utils.*?)|[\\w-_]+)"`,
    // 本地化配置
    "localize": "ch",
    "templateStrings": relativePaths.typedocStringTemplate
  }
  const execStr = `typedoc ${reduce(paramData, (argStr, value, key) => {
    return `${argStr} --${key} ${value}`
  }, '')} ${relativePaths.clintSrc}`
  return execStr
}