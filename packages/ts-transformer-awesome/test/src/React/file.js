import '../../../env';
import * as React from 'react';
export var TsxControlStatments = function () { 
// const a = null
// console.log(filters<() => void>(null))
// console.log(filters<number>(a, '3', 2))
// console.log(filters(a, '3', 2, a && 1 || 0 + 2, a && 1 || 0 + 3, 5, 6))
// console.log(filters<number>(a, '3', 2, a + 2, a + 3, 5, a + 5))
return (Array.from(([1, 2, 3]), function (item, itemIndex) { return [React.createElement(function (children) { return <h1 className="h1">{children}</h1>; }, null, item),
    React.createElement("a", { style: __$hoisted_o0 },
        itemIndex,
        item)]; })); };
var __$hoisted_o0 = { background: 'red' };
//# sourceMappingURL=file.js.map