import concat from "lodash/concat";
import join from "lodash/join";
import keys from "lodash/keys";
import values from "lodash/values";
export function createObjectKey(obj) {
    return join(concat(keys(obj), values(obj)));
}
//# sourceMappingURL=createObjectKey.js.map