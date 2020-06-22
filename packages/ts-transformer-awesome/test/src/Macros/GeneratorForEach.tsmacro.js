import { __awaiter, __generator } from "tslib";
export default function app() { var target_1 = [1, 2, 3], ccc_1 = console.log; return {
    a: [target_1, ccc_1, ],
    b: function (obj, _preUtils, message, assert, rule) {
        if (typeof message != 'string') {
            message = "\u8BF7 " + (matchType(obj.type, requiredBlackTypes) ? '选择' : '录入') + obj.label.replace(/\n/g, '');
        }
        var validate = (rule || {
            required: true,
            validator: function (_rule, value, callback) {
                // console.log(obj.label, value, isNotEmptyValue(value), isNotEmptyValue)
                if (Array.isArray(value) && value.length === 0) {
                    return callback(new Error('请至少录入一项'));
                }
                return isNotEmptyValue(value) ? callback() : callback(new Error(message));
            },
            message: undefined
        });
        return assert ? {
            loader: [
                useLoaderMacro('rules', function (form, utils) {
                    return __awaiter(this, void 0, void 0, function () { var used, _a, _b; return target_1(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, assert(form, utils)];
                            case 1:
                                used = (_c.sent());
                                _a = used;
                                if (!_a) return [3 /*break*/, 5];
                                if (!(validate instanceof Function)) return [3 /*break*/, 3];
                                return [4 /*yield*/, validate(form, utils)];
                            case 2:
                                _b = (_c.sent());
                                return [3 /*break*/, 4];
                            case 3:
                                _b = validate;
                                _c.label = 4;
                            case 4:
                                _a = (_b);
                                _c.label = 5;
                            case 5: 
                            // console.log(obj.code, used, form)
                            // if (obj.code === "tistrSeifVo.srid" || obj.code === 'tistrSeifVo.srit' && used) {
                            //   debugger
                            // }
                            return [2 /*return*/, _a || []];
                        }
                    }); });
                })
            ]
        } : { rules: [] };
    }
}; }
;
//# sourceMappingURL=GeneratorForEach.tsmacro.js.map