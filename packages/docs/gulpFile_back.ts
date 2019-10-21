// import typedoc from "gulp-typedoc";
import * as TypeDoc from "typedoc";
import gulp from "gulp";
import { exec } from "shelljs";
import { reduce } from "lodash";
import { relativePaths } from "@yuyi919/env/config/paths";

type TypeDocOptions = Partial<{
  /**
   * 使用捕获组指定正则表达式。然后将其用于将相关项目收集到一个模块中。
   */
  "externalModulemap": any;
  [key: string]: any;
}>;

const startIndex = process.argv.findIndex(key => /^typedoc/.test(key)) + 1
const arg = process.argv.splice(startIndex, process.argv.length - startIndex)
const options: TypeDocOptions = {
  // "entryPoint": "index.ts",
  "mode": "modules",
  "module": "commonjs",
  "target": "es5",
  "out": "docs",
  "tsconfig": "tsconfig.json",
  "name": "@yuyi919/utils",
  "includes": "src",
  "ignoreCompilerErrors": true,
  "hideGenerator": true,
  "includeDeclarations": true,
  "excludeExternals": true,
  "externalModulemap": ".*\/src\/([\\w-_]+)/",
  "excludePrivate": true,
  "excludeProtected": true
}


// const localizeOptions = {
//   "localize": "jp",
//   "templateStrings": "./docs-template.json"
// }
// const app = new TypeDoc.Application(options);
// console.log(arg, app.plugins.plugins)

// app.options.setValue("external-modulemap", options.externalModulemap)

// app.options.setValues(localizeOptions, 'plugin')

const paramData = {
  // typedoc样式配置
  "theme": relativePaths.typedocTheme,
  // typedoc配置文件
  "options": relativePaths.typedocConfig,
  // 根据路径配置模块展示
  "external-modulemap": `".*\/src\/([\\w-_]+)\/"`,
  // 本地化配置
  "localize": "ch",
  "templateStrings": relativePaths.typedocStringTemplate
}
const execStr = `typedoc ${reduce(paramData, (argStr, value, key) => {
  return `${argStr} --${key} ${value}`
}, '')} ${relativePaths.clintSrc}`

// let project: TypeDoc.ProjectReflection;
gulp.task("typedoc", async function () {
  // project = app.convert(app.expandInputFiles(['src']));
  // if (project) { // Project may not have converted correctly
  //   const outputDir = options.out;
  //   // Rendered docs
  //   app.generateDocs(project, outputDir);
  //   // Alternatively generate JSON output
  //   app.generateJson(project, outputDir + '/documentation.json');

  // }
  console.log(execStr, arg)
  exec(execStr)
  return;
})

gulp.task("typedoc-watch", gulp.parallel('typedoc', function () {
  gulp.watch("src/**/*.ts")
}))