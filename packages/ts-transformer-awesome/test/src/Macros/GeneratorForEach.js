import { __generator } from "tslib";
export default function app() { var i; return __generator(this, function (_a) {
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
