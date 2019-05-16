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
import Form from 'antd/lib/form';
import get from "lodash/get";
import set from "lodash/set";
import Utils from '../../utils';
export function filterToValue(v, defaultValue) {
    var v2 = Utils.isNotEmptyValueFilter(Utils.isArray(v) ? Utils.zipEmptyData(v) : v, defaultValue);
    return v2 === null ? undefined : v2;
}
export var objToForm = function (model, store, form) {
    var e_1, _a;
    var target = {};
    var r = {};
    console.log('objToForm', model);
    try {
        // console.log('formValueTransform', store.formValueTransform)
        for (var _b = __values(store.configStore.configList), _c = _b.next(); !_c.done; _c = _b.next()) {
            var config = _c.value;
            var v = get(model, config.code);
            var value = store.getF2VValue(config.code, filterToValue(v, config.value));
            // console.log('formValueTransform', config.code, value, v, store)
            set(target, config.code, Form.createFormField({ value: value }));
            // console.log('initvalue', config.code, v, value);
            if (!Utils.isEqual(v, value, true)) {
                // set(model, config.code, value)
                Object.assign(r, store.patchFieldsChange(set({}, config.code, { value: value, name: config.code })));
                // console.log('patchFieldsChange result', r, store);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
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
export var form = Form.create({
    onFieldsChange: function (props, changedFields, allValues) {
        //将表单变化的值绑定到store中
        // console.log('onFieldsChange', props, changedFields, allValues);
        var r = props.formStore.patchFieldsChange(changedFields);
        console.log('onFieldsChange patchFieldsChange result', r, changedFields);
    },
    onValuesChange: function (props, values, allValues) {
        console.log('onValuesChange', props, values, allValues);
    },
    mapPropsToFields: function (props) {
        //将store中的值绑定到视图中
        return objToForm(props.formStore.formSource, props.formStore, props.form);
    },
});
//# sourceMappingURL=util.js.map