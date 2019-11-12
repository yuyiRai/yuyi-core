"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../../../env");
var Utils = {
    a: filters,
    b: 1,
    c: function () {
        return Utils.a;
    },
    get dc() {
        return filters;
    }
};
Utils.a = filters;
var a = 1;
var key = ["a", "b", "c", "dc"];
console.log(null != null ? null : (undefined)); // Utils.a<() => void>(null)
var _$tmp_3;
console.log(a != null ? a : ('3' != null ? '3' : (2 != null ? 2 : ((((_$tmp_3 = (a && 1 || 0 + 2)) || 1) && _$tmp_3) != null ? _$tmp_3 : ((((_$tmp_3 = (a && 1 || 0 + 3)) || 1) && _$tmp_3) != null ? _$tmp_3 : (5 != null ? 5 : (6 != null ? 6 : (undefined)))))))); // filters(a, '3', 2, a && 1 || 0 + 2, a && 1 || 0 + 3, 5, 6)
function test(a) {
    function test() {
        var d = typeof a === "number" ? a : (typeof '3' === "number" ? '3' : (typeof 2 === "number" ? 2 : (undefined))); // Utils.dc<number>(a, '3', 2)
        return d;
    }
    var _$tmp_7;
    return (a != null ? a : ('3' != null ? '3' : (2 != null ? 2 : ((((_$tmp_7 = (a && 1 || 0 + 2)) || 1) && _$tmp_7) != null ? _$tmp_7 : ((((_$tmp_7 = (a && 1 || 0 + 3)) || 1) && _$tmp_7) != null ? _$tmp_7 : (5 != null ? 5 : (6 != null ? 6 : (undefined)))))))) && test(); // filters(a, '3', 2, a && 1 || 0 + 2, a && 1 || 0 + 3, 5, 6)
}
exports.test = test;
