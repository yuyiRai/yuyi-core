"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var shelljs_1 = require("shelljs");
var args_1 = __importDefault(require("./args"));
var colors_1 = __importDefault(require("colors"));
var type = ['patch', 'minor', 'major'];
var args = new args_1.default().addArgument(['-t', '-type'], {
    action: 'store',
    choices: type,
    dest: 'type',
    constant: 'patch',
    defaultValue: 'patch',
    help: "'patch', 'minor', 'major'"
}).addArgument(['-p', '-push'], {
    action: 'storeTrue',
    dest: 'push'
}).init();
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
    // exec('yarn publish')
}
catch (error) {
}
