"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
/**
 * 本项目的目录
 */
exports.envDirectory = path_1.default.join(fs_extra_1.default.realpathSync(__dirname), '..');
exports.clintDirectory = fs_extra_1.default.realpathSync(process.cwd());
exports.resolveModules = function (relativePath) { return path_1.default.resolve(exports.envDirectory, relativePath); };
exports.resolveClient = function (relativePath) { return path_1.default.resolve(exports.clintDirectory, relativePath); };
exports.envPublicUrl = process.env.PUBLIC_URL;
exports.getPublicUrl = function (clintPackageJson) {
    console.log(clintPackageJson);
    return exports.envPublicUrl || require(clintPackageJson).homepage;
};
exports.moduleFileExtensions = [
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
exports.resolveModule = function (resolveFn, filePath) {
    var extension = exports.moduleFileExtensions.find(function (extension) {
        return fs_extra_1.default.existsSync(resolveFn(filePath + "." + extension));
    });
    if (extension) {
        return resolveFn(filePath + "." + extension);
    }
    return resolveFn(filePath + ".js");
};
exports.distKeyName = {
    jsDir: 'js',
    cssDir: 'css',
    publicDir: 'static',
    distDir: 'dist',
    entryHtmlName: 'index.html',
    entryJsName: 'index.js'
};
var pathsBase = {
    requirePath: exports.resolveModules('./config/run-ts.js'),
    typedocGulpFile: exports.resolveModules('../docs/gulpfile.ts'),
    typedocConfig: exports.resolveModules('../docs/typedoc.json'),
    typedocConfigAsync: exports.resolveModules('../docs/typedoc.ts'),
    typedocStringTemplate: exports.resolveModules('../docs/config/stringTemplate.json'),
    typedocTheme: exports.resolveModules('../docs/bin/default'),
    dotenv: exports.resolveClient('.env'),
    clintPath: exports.resolveClient('.'),
    clintDist: exports.resolveClient('dist'),
    clintBuild: exports.resolveClient('build'),
    clintDepregistry: exports.resolveClient('dist/registry.json'),
    clintPublic: exports.resolveClient('public'),
    clintLib: exports.resolveClient('lib'),
    clintHtml: exports.resolveClient('public/index.html'),
    clintIndexJs: exports.resolveModule(exports.resolveClient, 'src/index'),
    clintPackageJson: exports.resolveClient('package.json'),
    clintSrc: exports.resolveClient('src'),
    clintTsConfig: exports.resolveModules('tsconfig.json'),
    clintTsConfigDev: exports.resolveModules('tsconfig.dev.json'),
    clintNodeModules: exports.resolveClient('node_modules'),
    publicUrl: exports.getPublicUrl(exports.resolveClient('package.json')),
};
exports.paths = __assign({}, pathsBase);
exports.pathSearcher = function (dir, suffix) {
    if (suffix === void 0) { suffix = "*"; }
    return path_1.default.join(dir, "**/*." + suffix);
};
function preventPath(path) {
    if (!fs_extra_1.default.existsSync(path)) {
        fs_extra_1.default.ensureDirSync(path);
    }
    return path;
}
exports.preventPath = preventPath;
exports.relativePaths = Object.entries(pathsBase).reduce(function (obj, _a) {
    var _b;
    var _c = __read(_a, 2), key = _c[0], value = _c[1];
    return value ? (__assign(__assign({}, obj), (_b = {}, _b[key] = path_1.default.relative(process.cwd(), value), _b))) : obj;
}, {});
exports.default = __assign(__assign({}, exports.paths), { clintDistMainHTML: path_1.default.join(exports.paths.clintDist, exports.distKeyName.entryHtmlName), clintDistCssDir: path_1.default.join(exports.paths.clintDist, exports.distKeyName.cssDir), clintDistScriptsDir: path_1.default.join(exports.paths.clintDist, exports.distKeyName.jsDir), clintDistPublicDir: path_1.default.join(exports.paths.clintDist, exports.distKeyName.publicDir), clintJsMatcher: exports.pathSearcher(exports.paths.clintLib, 'js'), clintTsMatcher: [exports.pathSearcher(exports.paths.clintSrc, 'ts'), exports.pathSearcher(exports.paths.clintSrc, 'tsx'), "!" + exports.pathSearcher(exports.paths.clintSrc, 'd.ts')], clintDTsMatcher: exports.pathSearcher(exports.paths.clintLib, 'd.ts'), clintCssMatcher: exports.pathSearcher(exports.paths.clintSrc, 'css'), clintSvgMatcher: exports.pathSearcher(exports.paths.clintSrc, 'svg'), clintEntryJs: path_1.default.join(exports.paths.clintLib, exports.distKeyName.entryJsName), clintBrowserifyCache: path_1.default.join(exports.paths.clintDist, 'browserify-cache.json') });
