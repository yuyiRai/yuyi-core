"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NodeUtils_1 = require("@yuyi919/utils/dist/NodeUtils");
const colors_1 = __importDefault(require("colors"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const publish_1 = __importDefault(require("../src/modules/publish"));
const pkgPath = path_1.default.join(__dirname, '../package.json');
const { version, description = '' } = require(pkgPath);
// console.log(version, description)
function requireCwdFile(pathStr) {
    const filePath = pathStr && path_1.default.join(process.cwd(), pathStr);
    if (filePath && fs_extra_1.default.pathExistsSync(filePath)) {
        console.log(colors_1.default.cyan('require file ' + filePath));
        return require(filePath) || true;
    }
    else {
        return null;
    }
}
exports.requireCwdFile = requireCwdFile;
const args = new NodeUtils_1.Args({
    version,
    description
});
const sub = args.parser.addSubparsers({ title: 'actions', description: 'anothers' });
const commitParser = sub.addParser("commit", {
    help: 'dev commit',
    version
});
commitParser.addArgument(["-p", "--push"], {
    action: 'storeTrue',
    dest: "push",
    defaultValue: false
});
const pubParser = sub.addParser("pub", {
    help: 'dev publish',
    version
});
pubParser.addArgument(["-p", "--package"], {
    action: 'store',
    type: 'string',
    dest: "usePublish",
    defaultValue: './package.json'
});
pubParser.addArgument(["-g", "--global-module"], {
    action: 'storeTrue',
    dest: "isGlobalModule"
});
const execParser = sub.addParser("exec", {
    help: 'exec *.ts file',
    version
});
execParser.addArgument('execFile', {
    action: 'store',
    type: 'string',
    metavar: '<file>',
    defaultValue: 'unknown'
});
execParser.addArgument(['-c', '--compiler'], {
    action: 'store',
    type: 'string',
    metavar: '<file>',
    defaultValue: 'unknown'
});
try {
    const [r, other] = args.parser.parseKnownArgs();
    // console.log(r, other)
    if (r.execFile) {
        console.error(r);
        requireCwdFile(r.execFile);
    }
    else if (r.usePublish) {
        const pkg = requireCwdFile(r.usePublish);
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
//# sourceMappingURL=cli.js.map