var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
import Utils from '../';
export function connectTo(target, source) {
    var e_1, _a;
    var keyNames = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        keyNames[_i - 2] = arguments[_i];
    }
    if (Utils.isNil(target) || Utils.isNil(source)) {
        return false;
    }
    if (keyNames.length === 0) {
        keyNames = Object.keys(source);
    }
    var _loop_1 = function (keyName) {
        if (!Object.getOwnPropertyDescriptor(target, keyName)) {
            Object.defineProperty(target, keyName, {
                get: function () {
                    return source[keyName];
                },
                set: function (value) {
                    source[keyName] = value;
                }
            });
        }
    };
    try {
        for (var keyNames_1 = __values(keyNames), keyNames_1_1 = keyNames_1.next(); !keyNames_1_1.done; keyNames_1_1 = keyNames_1.next()) {
            var keyName = keyNames_1_1.value;
            _loop_1(keyName);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (keyNames_1_1 && !keyNames_1_1.done && (_a = keyNames_1.return)) _a.call(keyNames_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return true;
}
//# sourceMappingURL=connectTo.js.map