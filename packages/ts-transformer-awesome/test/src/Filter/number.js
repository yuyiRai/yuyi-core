import { __spreadArrays } from "tslib";
import '../../../env';
var Utils = {
    a: filters,
    b: 1,
    c: function () { return Utils.a; },
    get dc() { return filters; }
};
Utils.a = filters;
var a = 1;
var key = tsKeys();
var _a = undefined;
var _tempArr_2 = [null];
var _tempLength_2 = 1;
var _tempIndex_2 = 0;
var _tempResult_2;
while (_tempIndex_2 < _tempLength_2) {
    if ((_tempResult_2 = _tempArr_2[_tempIndex_2++]) != null)
        break;
}
_a = _tempResult_2 != null ? _tempResult_2 : undefined;
console.log(_a); // Utils.a<() => void>(null)
var _b = undefined;
var _tempArr_4 = [a, '3', 2, a && 1 || 0 + 2, a && 1 || 0 + 3, 5, 6];
var _tempLength_4 = 7;
var _tempIndex_4 = 0;
var _tempResult_4;
while (_tempIndex_4 < _tempLength_4) {
    if ((_tempResult_4 = _tempArr_4[_tempIndex_4++]) != null)
        break;
}
_b = _tempResult_4 != null ? _tempResult_4 : undefined;
console.log(_b); // filters(a, '3', 2, a && 1 || 0 + 2, a && 1 || 0 + 3, 5, 6)
export function test(a, b) {
    if (process.env.NODE_ENV === "development") {
        console.log('dev');
    }
    function test() {
        var _a = undefined;
        var _tempArr_6 = __spreadArrays([a], b, ['3', 2]);
        var _tempLength_6 = _tempArr_6.length;
        var _tempIndex_6 = 0;
        var _tempResult_6;
        while (_tempIndex_6 < _tempLength_6) {
            if (typeof (_tempResult_6 = _tempArr_6[_tempIndex_6++]) === "number")
                break;
        }
        _a = typeof _tempResult_6 === "number" ? _tempResult_6 : undefined;
        var d = _a; // Utils.dc<number>(a, ...b, '3', 2)
        return d;
    }
    var _a = undefined;
    var _tempArr_8 = [a, '3', 2, a && 1 || 0 + 2, a && 1 || 0 + 3, 5, 6];
    var _tempLength_8 = 7;
    var _tempIndex_8 = 0;
    var _tempResult_8;
    while (_tempIndex_8 < _tempLength_8) {
        if ((_tempResult_8 = _tempArr_8[_tempIndex_8++]) != null)
            break;
    }
    _a = _tempResult_8 != null ? _tempResult_8 : undefined;
    return _a && test(); // filters(a, '3', 2, a && 1 || 0 + 2, a && 1 || 0 + 3, 5, 6)
}
