"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var argparse_1 = require("argparse");
var Args = /** @class */ (function () {
    function Args() {
        var _this = this;
        this.addArgument = function (a, b) {
            _this.parser.addArgument(a, b);
            return _this;
        };
        this.parser = new argparse_1.ArgumentParser({
            version: '0.0.1',
            addHelp: true,
            description: 'Argparse example'
        });
    }
    Args.prototype.init = function () {
        return this.parser.parseArgs();
    };
    return Args;
}());
exports.default = Args;
;
