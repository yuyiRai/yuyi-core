import { __generator } from "tslib";
import '../../../env';
;
function app() { var i; return __generator(this, function (_a) {
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
export function app2() {
    var __generator, runner_1 = app();
    while (__generator = runner_1.next(),
        !__generator.done) {
        console.log(__generator.value, __generator.done);
        ;
    }
    __generator.value;
    var arr = [1, 2, 3, 4, 5];
    var arr_1 = arr_1, len_1 = arr_1.length;
    var i_1 = 0, item_1;
    while (i_1 < len_1) {
        item_1 = arr_1[i_1++];
        console.log(item_1);
        ;
    }
    true;
}
//# sourceMappingURL=index.js.map