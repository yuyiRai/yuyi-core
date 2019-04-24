"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ItemConfig_1 = require("./ItemConfig");
function FormItemOptions() {
    var i = {
        code: 'value', nameCode: 'name', remoteMethod: function (key) {
            return new Promise(function (r) {
                setTimeout(function () {
                    console.log('key', key);
                    r(({ r1: [1, 2, 3, 4], r2: [5, 1, 2, 3, 4] })[key]);
                }, 500);
            });
        }
    };
    var form = { value: 1, name: 'r1' };
    var config = new ItemConfig_1.ItemConfig(i, form, {});
    config.remoteOptions;
    setTimeout(function () {
        config.form.name = 'r2';
    }, 1000);
}
exports.FormItemOptions = FormItemOptions;
//# sourceMappingURL=Test.js.map