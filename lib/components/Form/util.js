"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = __importDefault(require("antd/lib/form"));
var lodash_1 = require("lodash");
var utils_1 = __importDefault(require("../../utils"));
function filterToValue(v, defaultValue) {
    var v2 = utils_1.default.isNotEmptyValueFilter(utils_1.default.isArray(v) ? utils_1.default.zipEmptyData(v) : v, defaultValue);
    return v2 === undefined ? null : v2;
}
exports.filterToValue = filterToValue;
exports.objToForm = function (model, configList, store, form) {
    var e_1, _a;
    var target = {};
    var r = {};
    try {
        for (var configList_1 = __values(configList), configList_1_1 = configList_1.next(); !configList_1_1.done; configList_1_1 = configList_1.next()) {
            var config = configList_1_1.value;
            var v = lodash_1.get(model, config.code);
            var value = filterToValue(v, config.value);
            lodash_1.set(target, config.code, form_1.default.createFormField({ value: value }));
            // console.log('initvalue', config.code, v, value);
            if (!utils_1.default.isEqual(v, value, true)) {
                // set(model, config.code, value)
                Object.assign(r, store.patchFieldsChange(lodash_1.set({}, config.code, { value: value, name: config.code })));
                // console.log('patchFieldsChange result', r, store);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (configList_1_1 && !configList_1_1.done && (_a = configList_1.return)) _a.call(configList_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    // setTimeout(() => {
    //   console.log('patchFieldsChange result', store.formItemConfigMap.$antdForm.validateFields(Object.keys(r)), r, store);
    // }, 100);
    // console.log('mapPropsToFields', target)
    // for (let [key, value] of Object.entries(model)) {
    //   target[key] = Form.createFormField({ value })
    // }
    return target;
};
exports.form = form_1.default.create({
    onFieldsChange: function (props, changedFields, allValues) {
        //将表单变化的值绑定到store中
        // console.log('onFieldsChange', props, changedFields, allValues);
        var r = props.storeForm.patchFieldsChange(changedFields);
        console.log('onFieldsChange patchFieldsChange result', r);
    },
    onValuesChange: function (props, values, allValues) {
        // console.log('onValuesChange', props, values, allValues);
    },
    mapPropsToFields: function (props) {
        //将store中的值绑定到视图中
        return exports.objToForm(props.storeForm.formSource, props.config, props.storeForm, props.form);
    },
});