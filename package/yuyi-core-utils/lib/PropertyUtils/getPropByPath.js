/**
 * @module PropertyUtils
 */
/**
 *
 * @param obj 对象
 * @param path 解析路径
 * @param strict 是否严格模式，obj解析出错时弹出错误
 */
export function getPropByPath(obj, path, strict) {
    if (strict === void 0) { strict = false; }
    var tempObj = obj;
    path = path.replace(/\[(\w+)\]/g, '.$1');
    path = path.replace(/^\./, '');
    var keyArr = path.split('.');
    var i = 0;
    for (var len = keyArr.length; i < len - 1; ++i) {
        if (!tempObj && !strict) {
            break;
        }
        var key = keyArr[i];
        if (key in tempObj) {
            tempObj = tempObj[key];
        }
        else {
            if (strict) {
                throw new Error('please transfer a valid prop path to form item!');
            }
            break;
        }
    }
    return {
        o: tempObj,
        k: keyArr[i],
        v: tempObj ? tempObj[keyArr[i]] : null
    };
}
//# sourceMappingURL=getPropByPath.js.map