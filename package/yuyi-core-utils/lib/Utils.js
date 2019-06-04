var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/* eslint-disable */
import commonUtils from './commonUtils';
import * as OptionsUtils from './OptionsUtils';
import * as PropertyUtils from './PropertyUtils';
import * as CustomUtils from './CustomUtils';
import TimeBufferUtils from './TimeBuffer';
import { typeFilterUtils, typeUtils } from "./TypeLib";
import * as ParseUtils from "./ParseUtils";
import * as MobxUtils from './MobxUtils';
export var Utils = (__assign({}, commonUtils, OptionsUtils, TimeBufferUtils, typeUtils, PropertyUtils, typeFilterUtils, CustomUtils, ParseUtils, MobxUtils));
//# sourceMappingURL=Utils.js.map