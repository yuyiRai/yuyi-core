"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../../../env");
var a = 1;
console.log((function () {
    var _$tmp;
    return (((_$tmp = (null)) || 1) && _$tmp) != null ? _$tmp : (undefined);
})() // filters<() => void>(null)
);
console.log(typeof a === "number" ? a : (typeof '3' === "number" ? '3' : (typeof 2 === "number" ? 2 : (undefined))) // filters<number>(a, '3', 2)
);
console.log((function () {
    var _$tmp;
    return a != null ? a : ('3' != null ? '3' : (2 != null ? 2 : ((((_$tmp = (a && 1 || 0 + 2)) || 1) && _$tmp) != null ? _$tmp : ((((_$tmp = (a && 1 || 0 + 3)) || 1) && _$tmp) != null ? _$tmp : (5 != null ? 5 : (6 != null ? 6 : (undefined)))))));
})() // filters(a, '3', 2, a && 1 || 0 + 2, a && 1 || 0 + 3, 5, 6)
);
