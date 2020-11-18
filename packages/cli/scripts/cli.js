"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const publish_1 = __importDefault(require("../src/modules/publish"));
const params_1 = require("./params");
function join(str, ...arr) {
    return arr.filter(i => i).join(str);
}
function formatter(str) {
    str = str.replace(/\[(.*?)\]/ig, colors_1.default.underline(colors_1.default.yellow(`$1`)));
    str = str.replace(/\`(.*?)\`/ig, colors_1.default.bgWhite(colors_1.default.black(`$1`)));
    str = str.replace(/\((.*?)\)/ig, colors_1.default.hidden(colors_1.default.grey(`$1`)));
    return colors_1.default.cyan(str);
}
function logger(message, source = 'cli') {
    console.log(join('', source && colors_1.default.green(`[${source}]> `), formatter(message)));
}
function requireCwdFile(pathStr, action = 'require') {
    const filePath = pathStr && path_1.default.resolve(pathStr);
    if (filePath && fs_extra_1.default.pathExistsSync(filePath)) {
        logger(action + `: [${filePath}]`);
        return require(filePath) || true;
    }
    else {
        return null;
    }
}
exports.requireCwdFile = requireCwdFile;
exports.default = (tsconfig, loader) => {
    try {
        if (params_1.main.debug) {
            logger('use `debug` mode (123)');
        }
        logger(`loaded tsconfig: [${tsconfig}]`);
        const r = params_1.main;
        // console.log(r, other)
        if (r.execFile) {
            // console.error(r)
            return requireCwdFile(r.execFile, "exec");
        }
        else if (r.usePublish) {
            const pkg = requireCwdFile(r.usePublish, "read config");
            if (pkg) {
                // console.log(pkg)
                publish_1.default({
                    pub: true,
                    access: 'public',
                    after: r.isGlobalModule && `yarn global add ${pkg.name}@latest` || null
                });
            }
        }
        else if ('push' in r) {
            publish_1.default({
                git: true,
                push: r.push
            });
        }
    }
    catch (error) {
        console.error(error);
        process.exit(0);
    }
    return null;
};
//# sourceMappingURL=cli.js.map