var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import fs from 'fs-extra';
import path from 'path';
// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
/**
 * 本项目的目录
 */
export var envDirectory = path.join(fs.realpathSync(__dirname), '..');
export var clintDirectory = fs.realpathSync(process.cwd());
export var resolveProject = function (relativePath) { return path.resolve(envDirectory, relativePath); };
export var resolveApp = function (relativePath) { return path.resolve(clintDirectory, relativePath); };
export var envPublicUrl = process.env.PUBLIC_URL;
export var getPublicUrl = function (clintPackageJson) {
    console.log(clintPackageJson);
    return envPublicUrl || require(clintPackageJson).homepage;
};
export var moduleFileExtensions = [
    'web.mjs',
    'mjs',
    'web.js',
    'js',
    'web.ts',
    'ts',
    'web.tsx',
    'tsx',
    'json',
    'web.jsx',
    'jsx',
];
/**
 * Resolve file paths in the same order as webpack
 * @param resolveFn
 * @param filePath
 */
export var resolveModule = function (resolveFn, filePath) {
    var extension = moduleFileExtensions.find(function (extension) {
        return fs.existsSync(resolveFn(filePath + "." + extension));
    });
    if (extension) {
        return resolveFn(filePath + "." + extension);
    }
    return resolveFn(filePath + ".js");
};
export var distKeyName = {
    jsDir: 'js',
    cssDir: 'css',
    publicDir: 'static',
    distDir: 'dist',
    entryHtmlName: 'index.html',
    entryJsName: 'index.js'
};
var pathsBase = {
    requirePath: resolveProject('./config/run-ts.js'),
    typedocGulpFile: resolveProject('../yuyi-core-docs/gulpfile.ts'),
    typedocConfig: resolveProject('../yuyi-core-docs/typedoc.json'),
    typedocConfigAsync: resolveProject('../yuyi-core-docs/typedoc.ts'),
    typedocStringTemplate: resolveProject('../yuyi-core-docs/config/stringTemplate.json'),
    typedocTheme: resolveProject('../yuyi-core-docs/bin/default'),
    dotenv: resolveApp('.env'),
    clintPath: resolveApp('.'),
    clintDist: resolveApp('dist'),
    clintBuild: resolveApp('build'),
    clintDepregistry: resolveApp('dist/registry.json'),
    clintPublic: resolveApp('public'),
    clintLib: resolveApp('lib'),
    clintHtml: resolveApp('public/index.html'),
    clintIndexJs: resolveModule(resolveApp, 'src/index'),
    clintPackageJson: resolveApp('package.json'),
    clintSrc: resolveApp('src'),
    clintTsConfig: resolveProject('tsconfig.json'),
    clintTsConfigDev: resolveProject('tsconfig.dev.json'),
    clintNodeModules: resolveApp('node_modules'),
    publicUrl: getPublicUrl(resolveApp('package.json')),
};
export var paths = __assign({}, pathsBase);
export var pathSearcher = function (dir, suffix) {
    if (suffix === void 0) { suffix = "*"; }
    return path.join(dir, "**/*." + suffix);
};
export function preventPath(path) {
    if (!fs.existsSync(path)) {
        fs.ensureDirSync(path);
    }
    return path;
}
export var relativePaths = Object.entries(pathsBase).reduce(function (obj, _a) {
    var _b;
    var _c = __read(_a, 2), key = _c[0], value = _c[1];
    return value ? (__assign({}, obj, (_b = {}, _b[key] = path.relative(process.cwd(), value), _b))) : obj;
}, {});
export default __assign({}, paths, { clintDistMainHTML: path.join(paths.clintDist, distKeyName.entryHtmlName), clintDistCssDir: path.join(paths.clintDist, distKeyName.cssDir), clintDistScriptsDir: path.join(paths.clintDist, distKeyName.jsDir), clintDistPublicDir: path.join(paths.clintDist, distKeyName.publicDir), clintJsMatcher: pathSearcher(paths.clintLib, 'js'), clintTsMatcher: [pathSearcher(paths.clintSrc, 'ts'), pathSearcher(paths.clintSrc, 'tsx'), "!" + pathSearcher(paths.clintSrc, 'd.ts')], clintDTsMatcher: pathSearcher(paths.clintLib, 'd.ts'), clintCssMatcher: pathSearcher(paths.clintSrc, 'css'), clintSvgMatcher: pathSearcher(paths.clintSrc, 'svg'), clintEntryJs: path.join(paths.clintLib, distKeyName.entryJsName), clintBrowserifyCache: path.join(paths.clintDist, 'browserify-cache.json') });
