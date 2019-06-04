/**
 * @module PropertyUtils
 * Gets the property value at path of object. If the resolved value is undefined the defaultValue is used
 * in its place.
 *
 * @param object The object to query.
 * @param path The path of the property to get.
 * @param defaultValue The value returned if the resolved value is undefined.
 * @return Returns the resolved value.
 *
 * @see _.get
 */
import get from 'lodash/get';
import { NumericDictionary } from "lodash";
import { PropertyPath } from "lodash";
export var Lodash;
(function (Lodash) {
    Lodash.get = Lodash.get;
})(Lodash || (Lodash = {}));
export { get };
//# sourceMappingURL=get.js.map