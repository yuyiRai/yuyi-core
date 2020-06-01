import { __assign, __read, __rest, __spread } from "tslib";
import fs from 'fs-extra';
import * as gulp from 'gulp';
import { isObject, unset, set, isEqual } from 'lodash';
import jeditor from 'gulp-json-editor';
import JSON5 from 'json5';
import DefaultOptions from '../tsconfig.json';
import envDefaultOptions from '../tsconfig.env.json';
var defaultCompilerOptions = __assign(__assign({}, envDefaultOptions.compilerOptions), DefaultOptions.compilerOptions);
JSON.parse = JSON5.parse;
var dirs = fs.readdirSync('./packages').filter(function (name) { return !/demo/.test(name); });
console.error(dirs);
var getAppendPaths = function (appendDir) {
    if (appendDir === void 0) { appendDir = ""; }
    return ({
        "@": ["./" + appendDir],
        "@/*": appendDir ? ["./" + appendDir + "/*"] : ["./*"]
    });
};
function definedPaths(other, useSrc) {
    if (useSrc === void 0) { useSrc = true; }
    var appendPaths = getAppendPaths(useSrc ? "src" : "");
    var paths = other.paths;
    var pathKeys = Array.from(new Set(__spread((isObject(paths) ? Object.keys(paths) : []), Object.keys(appendPaths))));
    return pathKeys.reduce(function (obj, key) {
        var _a;
        return obj[key] ? obj : Object.assign(obj, (_a = {}, _a[key] = appendPaths[key], _a));
    }, paths || {});
}
function definedRoot(other, srcOnly) {
    if (srcOnly === void 0) { srcOnly = true; }
    var pathStr = srcOnly ? './src' : './';
    return { rootDir: pathStr, baseUrl: pathStr, paths: definedPaths(other, !srcOnly) };
}
function definedOutput() {
    return {
        declarationDir: './types',
        outDir: './lib'
    };
}
function diffPlugins(plugins) {
    if (plugins === void 0) { plugins = []; }
    var defaultPlugins = defaultCompilerOptions.plugins;
    plugins = Array.from(new Set(plugins.map(function (i) { return JSON.stringify(i); }))).map(function (i) { return JSON.parse(i); });
    var r = plugins.filter(function (plugin) { return !defaultPlugins.find(function (df) { return isEqual(df, plugin); }); });
    return r.length > 0 ? r.concat(defaultPlugins) : undefined;
}
var whiteList = ['./tsconfig.json', '../../node_modules/assemblyscript/std/assembly.json'];
function taskFactroy(folder) {
    var srcs = ['./packages/' + folder + '/tsconfig.json'];
    return function () {
        return gulp.src(srcs, { allowEmpty: true }).pipe(jeditor(function (json) {
            console.error('loading', json.extends, json.extends === './tsconfig.json');
            var references = json.references, extendsC = json.extends, include = json.include, exclude = json.exclude, compilerOptions = json.compilerOptions, other = __rest(json, ["references", "extends", "include", "exclude", "compilerOptions"]);
            if (!whiteList.includes(json.extends)) {
                set(json, 'extends', '../../tsconfig.json');
            }
            var _a = definedRoot(compilerOptions, folder !== 'core'), rootDir = _a.rootDir, baseUrl = _a.baseUrl, paths = _a.paths;
            var _b = definedOutput(), outDir = _b.outDir, declarationDir = _b.declarationDir;
            var plugins = compilerOptions.plugins, types = compilerOptions.types, otherCompilerOptions = __rest(compilerOptions, ["plugins", "types"]);
            var forceOptions = {
                composite: true,
                rootDir: rootDir, baseUrl: baseUrl, paths: paths, outDir: outDir, declarationDir: declarationDir,
                tsBuildInfoFile: '../.tsBuildInfo/' + folder.replace('yuyi-', '') + '.json',
                incremental: true,
                plugins: diffPlugins(plugins),
                types: types
            };
            if (folder !== 'env' && folder !== 'core') {
                forceOptions.types = Array.from(new Set((types || []).concat(["@yuyi919/env/types/global"])));
            }
            Object.keys(otherCompilerOptions).forEach(function (key) {
                if (key in forceOptions || isEqual(otherCompilerOptions[key], defaultCompilerOptions[key])) {
                    // console.log(key, compilerOptions)
                    unset(otherCompilerOptions, key);
                }
            });
            var r = __assign(__assign({ extends: (!whiteList.includes(extendsC) ? '../../tsconfig.json' : extendsC), references: references, compilerOptions: __assign(__assign({}, forceOptions), otherCompilerOptions) }, other), { include: include,
                exclude: exclude });
            // console.log(r, rootDir, baseUrl, paths)
            return r;
        })).pipe(gulp.dest("./packages/" + folder));
    };
}
gulp.task('default', gulp.series(dirs.map(function (name) { return taskFactroy(name); })));
//# sourceMappingURL=tsconfig.mix.js.map