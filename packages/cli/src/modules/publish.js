"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shelljs_1 = require("shelljs");
function publish(args) {
    if (args.git) {
        shelljs_1.exec(`git add .`);
    }
    if (args.pub) {
        shelljs_1.exec(`yarn version --new-version ${args.type || 'patch'} && git add .`);
    }
    if (args.git) {
        shelljs_1.exec('git commit -a -m "NEXT"');
        if (args.push) {
            shelljs_1.exec('git push --set-upstream origin master');
        }
    }
    if (args.pub) {
        shelljs_1.exec(['yarn publish', args.access && '--access=' + args.access || ''].join(' '));
    }
    if (args.after) {
        shelljs_1.exec(args.after);
    }
}
exports.default = publish;
//# sourceMappingURL=publish.js.map