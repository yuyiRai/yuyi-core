"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
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
console.log(Utils.a(null));
console.log(filters(a, '3', 2, a && 1 || 0 + 2, a && 1 || 0 + 3, 5, 6));
function test(a, b) {
    function test() {
        var d = Utils.dc.apply(Utils, __spreadArrays([a], b, ['3', 2]));
        return d;
    }
    return filters(a, '3', 2, a && 1 || 0 + 2, a && 1 || 0 + 3, 5, 6) && test();
}
exports.test = test;
