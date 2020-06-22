import { __generator } from "tslib";
import "../../../env";
;
function testGenerator() { var i; return __generator(this, function (_a) {
    switch (_a.label) {
        case 0:
            i = 0;
            _a.label = 1;
        case 1:
            if (!(i < 10)) return [3 /*break*/, 4];
            return [4 /*yield*/, i];
        case 2:
            _a.sent();
            _a.label = 3;
        case 3:
            i++;
            return [3 /*break*/, 1];
        case 4: return [2 /*return*/];
    }
}); }
;
function test() {
    var __generator = testGenerator();
    var loop_1;
    while (loop_1 = __generator.next(), !loop_1.done) {
        var v_1 = loop_1.value, done_1 = loop_1.done;
        console.log(v_1, done_1);
        ;
    }
    var result1 = loop_1.value;
    var target_1 = [1, 2, 3, 4, 5];
    var len_1 = target_1.length, i_1 = 0, item_1;
    while (i_1 < len_1) {
        item_1 = target_1[i_1++];
        console.log(3);
        ;
    }
    var result2 = true;
    return {
        result1: result1,
        result2: result2
    };
}
//# sourceMappingURL=a.js.map