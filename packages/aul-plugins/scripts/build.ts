import path from 'path';
import fs from 'fs-extra';
import { memoize } from 'lodash'
// import gulp from 'gulp';
// import gulpShell from 'gulp-shell'

const srcDir = "src"
const buildDir = "lib"

const nameCache = {};
export function generateModuleName(path: string) {
  return nameCache[path] || (nameCache[path] = path.replace(/(src|\.lua|[\\])/g, "_"));
}
export function generateLoadModule(name: string) {
  return `___MODULE.__require("${name}", _G, package)`;
}

const sourcePath = path.join(process.cwd(), srcDir);
export function resolveModule(filePath: string, store: Map<string, [string, string]> = new Map(), rootPath?: string[]) {
  filePath = resolve(filePath)
  rootPath = (rootPath && rootPath.map(path => resolve(path)) || [filePath]);
  if (filePath) {
    let file = fs.readFileSync(filePath).toString();
    const reg = /require([( ]*?)[ "']+(.*?)["')]+/g;
    let find = null;
    while (find = reg.exec(file)) {
      const [catchedText, , mathced] = find || [];
      const resolvePath = findPath(mathced, filePath);
      if (resolvePath && !rootPath.includes(resolvePath)) {
        console.log('resolve: ', mathced, findPath(mathced, filePath), filePath, catchedText);
        resolveModule(resolvePath, store, rootPath);
        const name = generateModuleName(resolvePath);
        file = file.replace(catchedText, generateLoadModule(name));
      }
    }
    store.set(filePath, [file, generateModuleName(filePath)]);
  }
  return store;
}

export function findPath(requirePath: string, filePath: string) {
  let findPath = resolve(path.join(sourcePath, requirePath));
  // console.log('find', findPath);
  if (findPath) {
    return findPath;
  }
  findPath = resolve(path.join(path.dirname(filePath), requirePath));
  // console.log('find', findPath);
  if (findPath) {
    return findPath;
  }
  return null;
}
export const resolve = memoize(function resolve(filePath: string) {
  if (filePath) {
    filePath = filePath.replace(/\./g, "\\").replace(/\\lua$/, ".lua");
    if (path.extname(filePath) !== '.lua')
      filePath = filePath + '.lua';
    // console.log(filePath, path.extname(filePath))
    if (fs.existsSync(filePath)) {
      return path.relative(process.cwd(), filePath);
    }
  }
  return null;
})



export function output(outPath: string, moduleName: string, content: string) {
  const buildDir = path.dirname(outPath);
  if (!fs.pathExistsSync(buildDir)) {
    fs.mkdirSync(buildDir);
  }
  fs.writeFileSync(outPath, `
local ___MODULE = {}
___MODULE.__isLoaded = {}
___MODULE.__loaded = {}
___MODULE.__require = function (path, _G, package)
  if ___MODULE.__isLoaded[path] then
    return ___MODULE.__loaded[path] 
  end
  ___MODULE.__isLoaded[path] = true
  ___MODULE.__loaded[path] = ___MODULE[path](_G, package)
  return ___MODULE.__loaded[path]
end
${content}
___MODULE.__require("${moduleName}", _G, package)
`);
}

export function execBuild(entry: string[]) {
  for (const filePath of entry) {
    const files = [];
    const result = Array.from(
      resolveModule(path.join(sourcePath, filePath), undefined, entry),
      ([p, [file, name]]) => {
        files.push(`
___MODULE.${name} = function(_G, package)
      ${file.replace(/\n/g, "\n      ")}
end
    `);
        return ['.\\' + p, '.\\' + p.replace(srcDir, buildDir), name];
      }
    );
    const [, buildPath, name] = result[result.length - 1];
    output(buildPath, name, files.join("\n"));
    // console.log(result);
  }
}

const filePath = process.argv[process.argv.length - 1];
// console.log(filePath)
execBuild(filePath.split(','))
