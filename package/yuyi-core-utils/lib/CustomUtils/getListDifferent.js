import differenceWith from "lodash/differenceWith";
import isEqual from "lodash/isEqual";
export function getListDifferent(listA, listB, deep) {
    if (deep === void 0) { deep = false; }
    return {
        push: differenceWith(listB, listA, deep ? (function (a, b) { return isEqual(a, b); }) : []),
        pull: differenceWith(listA, listB, deep ? (function (a, b) { return isEqual(a, b); }) : [])
    };
}
//# sourceMappingURL=getListDifferent.js.map