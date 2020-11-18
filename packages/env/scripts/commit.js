"use strict";
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
var shelljs_1 = require("shelljs");
var argparse_extra_1 = require("@yuyi919/argparse-extra");
var colors_1 = __importDefault(require("colors"));
var type = ['patch', 'minor', 'major'];
var _a = __read(new argparse_extra_1.Args().addArgument(['-t', '-type'], {
    action: 'store',
    choices: type,
    dest: 'type',
    constant: 'patch',
    defaultValue: 'patch',
    help: "'patch', 'minor', 'major'"
}).addArgument(['-p', '-push'], {
    action: 'storeTrue',
    dest: 'push'
}).init(), 1), args = _a[0];
console.log(args);
if (!type.includes(args.type)) {
    throw new Error();
}
console.log(colors_1.default.cyan('run git commit -a -m "NEXT"'));
try {
    shelljs_1.exec("git add .");
    // exec(`yarn version --new-version ${args.type} && git add .`)
    shelljs_1.exec('git commit -a -m "NEXT"');
    if (args.push) {
        shelljs_1.exec('git push --set-upstream origin master');
    }
}
catch (error) { }
