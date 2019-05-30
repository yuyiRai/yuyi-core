/* eslint-disable */
// import Vue from 'vue';
// import SelectColumn from '@/components/TablePage/table-column/select.vue'
// import { dateFormat } from '@/filters/index.js'
// import { observer } from 'mobx-vue'
// export default observer(Vue.component('ViewItem', {
//   name: 'ViewItem',
//   data(){
//     return {
//       viewValue: undefined
//     }
//   },
//   computed: {
//     view(){
//       const { code, nameCode, form } = this.itemConfig;
//       return Utils.isNotEmptyValueFilter(
//         this.viewValue, 
//         form[nameCode], 
//         form[code.replace('Code', '')], 
//         form[code.replace('Code', 'Name')], 
//         form[code+'Name'], 
//         Utils.castArray(this.value).join(',')
//       )
//     }
//   },
//   created() {
//     const { type, remoteMethod, code, nameCode, form } = this.itemConfig;
//     switch(type) {
//       case 'search': 
//         const search = _.get(form, nameCode, _.get(form, code, null))
//         console.log(search, this.itemConfig, form)
//         search && remoteMethod(search).then(r=>{
//           console.log(code, search, r)
var _this = this;
//         })
//       break;
//     }
//   },
//   render(h) {
//     const { view: value, itemConfig } = this;
//     const { useSlot, type } = itemConfig
//     if(type==='radioOne'){
//       return <span>{value?"是":"否"}</span>
//     } else if(type==='date' || type==='dateTime'){
//       return (
//         <span>{ 
//           Utils.isNotEmptyValue(value) 
//           ? dateFormat(new Date(value), 'yyyy-MM-dd' + (type==='dateTime'?' hh:mm:ss':''))
//           : `` // `----/--/--${type === 'dateTime' ? " --:--:--" : ""}`
//         }</span>
//       )
//     } else if((type==='select' || type==='radio')) {
//       // console.log(itemConfig.label, value, itemConfig.options, this.value)
//       return <SelectColumn value={value} split={itemConfig.split} options={itemConfig.options} />
//     } else if(type==='address') {
//       const { areaName, cityName, provinceName, [itemConfig.code+'Key']: addressName} = itemConfig.form
//       // console.log(itemConfig, itemConfig.label, itemConfig.form[itemConfig.code+'Name'])
//       return <span><span> { Utils.zipEmptyData(Utils.isStringFilter(itemConfig.form[itemConfig.code+'Name'], '').split('|')).join('-') } </span><span>{itemConfig.suffix}</span></span>
//     } else if(useSlot !== null && Utils.isFunction(this.$scopedSlots[useSlot])) {
//       // console.log('view item', itemConfig, itemConfig.code,this.$scopedSlots , useSlot)
//       return this.$scopedSlots[useSlot]({data: value, props: itemConfig.form})
//     } else {
//       return <span><span> { value } </span><span>{itemConfig.suffix}</span></span>
//     }
//   },
//   props: {
//     value: {},
//     itemConfig: {},
//   }
// }))
import * as React from 'react';
var ViewItem = function (props) {
    var value = props.value, itemConfig = props.itemConfig;
    var useSlot = itemConfig.useSlot, slot = itemConfig.slot, type = itemConfig.type;
    if (type === 'radioOne') {
        return React.createElement("span", null, value ? "是" : "否");
    }
    else if (type === 'date' || type === 'dateTime') {
        return (React.createElement("span", null, Utils.isNotEmptyValue(value)
            ? value
            : "" // `----/--/--${type === 'dateTime' ? " --:--:--" : ""}`
        ));
    }
    else if ((type === 'select' || type === 'radio')) {
        // console.log(itemConfig.label, value, itemConfig.options, this.value)
        return Utils.valuesToLabels(itemConfig.options, value);
    }
    else if (type === 'address') {
        // console.log(itemConfig, itemConfig.label, itemConfig.form[itemConfig.code+'Name'])
        return React.createElement("span", null,
            React.createElement("span", null,
                " ",
                Utils.zipEmptyData(Utils.isStringFilter(itemConfig.form[itemConfig.code + 'Name'], '').split('|')).join('-'),
                " "),
            React.createElement("span", null, itemConfig.suffix));
    }
    else if (useSlot !== null && Utils.isFunction(_this.$scopedSlots[slot])) {
        // console.log('view item', itemConfig, itemConfig.code,this.$scopedSlots , useSlot)
        return useSlot && _this.$scopedSlots[slot]({ data: value, props: itemConfig.form });
    }
    else {
        return React.createElement("span", null,
            React.createElement("span", null,
                " ",
                value,
                " "),
            React.createElement("span", null, itemConfig.suffix));
    }
};
export default ViewItem;
//# sourceMappingURL=ViewItem.js.map