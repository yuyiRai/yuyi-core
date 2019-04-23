/* eslint-disable */
export * from './DatePickerItem'
import ViewItem from './ViewItem'
import DataPackerItem from './DatePickerItem'
import SelectTreeItem from './SelectTree'
import { CascaderItem } from './CascaderItem'
import SelectAndSearchItem from './SelectAndSearchItem'
import AddressItem from './AddressItem'
import RadioOneItem from './RadioOneItem'
import RadioItem from './RadioItem'
import InputItem from './InputItem'
import { observer } from 'mobx-vue'

export default observer({
  name: 'CInputItem',
  functional: true,
  render(h, { data, children, listeners, props, parent, ...other }) {
    // console.log({ data, children, listeners, props, parent, ...other })
    const { ['change']: onChange1 = () => {}, ['change-with']: onChangeWith = () => {}, ['validate']: onValidate = () => {} } = listeners
    const onChange = (value, ...args)=>{
      // debugger
      // console.log(args)
      onChange1(value, false)
    }
    const { value: ngValue, disabled, form, dto, createChildren, viewOnly, itemConfig, suffix } = props;
    const value = Utils.toJS(ngValue)
    const { type = "text", value: defaultValue, slot: useSlot } = itemConfig;
    if(viewOnly && !['check', 'address', 'textarea'].includes(type)) {
      return <ViewItem ref='input' value={value} itemConfig={itemConfig} />
    } else if(type==='date' || type==='dateTime' || type==="dateToDate"){
      // <!-- 日期 -->
      return (
        <DataPackerItem ref='input' type={type} value={value} onChange={onChange} itemConfig={itemConfig} disabled={disabled} />
      )
    } else if(type==='select' || type==='search') {
      const { code, valueCode = code, nameCode } = itemConfig;
      //下拉选择 或 查询输入下拉
      const key = Utils.isNotEmptyStringFilter(nameCode, code)
      // if(itemConfig.label==='就诊医院')
      //   debugger
      const searchName = (nameCode===code || Utils.isNil(nameCode)) ? (value) : (type==='search' && (dto ? dto.get(key) : form[key]));
      // console.log(itemConfig.label, (nameCode===code || Utils.isNil(nameCode)))
      return (
        <SelectAndSearchItem ref='input' itemConfig={itemConfig} type={type} value={value} searchName={searchName} onChange={onChange} onValidate={onValidate} disabled={disabled} onChange-with={onChangeWith} />
      )
    } else if(type==='selectTree') {
      //下拉树
      const { options, placeholder, code, valueCode = code, nameCode, optionCode } = itemConfig;
      const props = { value: valueCode, parent: valueCode, label: nameCode, children: 'children', nodeCode: optionCode }
      return (
        <SelectTreeItem ref='input' inputKey={code} options={options} value={value} props={props} placeholder={placeholder} onSelected={onChange} disabled={disabled} onChange-with={onChangeWith} />
      )
    } else if(type == 'check') {
      // 多选框
      // console.log(other)
      const getOnItemChange = iValue => (isChecked2, event) => {
        const safeValue = Utils.isArrayFilter(value, [])
        const isChecked = !safeValue.some(i=>Utils.isEqual(i, iValue));
        isChecked?safeValue.push(iValue):safeValue.splice(safeValue.indexOf(iValue),1)
        return onChange([...safeValue])
      }
      const children = itemConfig.options && _.map(itemConfig.options, (item, itemIndex) => {
        const { value: iValue, label: iLabel, disabled: iDisabled } = item;
        const onItemChange = viewOnly?(()=>{}):getOnItemChange(iValue)
        if(!Utils.isEmptyValue(useSlot) && createChildren instanceof Function){
          const children = createChildren({ data: value, item, index: itemIndex, props: form })
          children[0][0].data.on = children[0][0].data.on || {};
          children[0][0].data.on.change = (e) => parent.$nextTick(()=>onItemChange(e.target.checked, e)) //.$nextTick()
          return children
        }
        return <elCheckbox key={iValue+iLabel} label={iValue} disabled={iDisabled || disabled } onChange={onItemChange}>{ iLabel }</elCheckbox>;
      })
      return (
        <elCheckboxGroup ref='input' value={value} disabled={disabled}>{children}</elCheckboxGroup>
      )
    } else if(type==='checkOne'){
      return <elSwitch ref='input' value={value} onChange={onChange} disabled={disabled} />
    } else if(!type || type==='text') {
      // 一般输入框
      return (
        <InputItem ref='input' value={value} onChange={onChange} itemConfig={itemConfig} suffix={suffix} disabled={disabled}/>
      )
    } else if(type==='number') {
      // console.log('number')
      return (<span>
          <elInputNumber class={{'increase-only': itemConfig.increaseOnly}} ref='input' style="width: calc(80% - 20px);" precision={Utils.isNumberFilter(parseInt(itemConfig.numberControl), 0)} value={Utils.isNumberFilter(value, itemConfig.value, 0)} onChange={onChange} disabled={disabled} 
              step={Utils.isNumberFilter(itemConfig.step, 1/Math.pow(10, itemConfig.numberControl || 2))} controls={itemConfig.useControl} 
              controls-position='right' min={0} placeholder={itemConfig.placeholder || ('请输入'+itemConfig.label)}></elInputNumber>
            {Utils.jsxIf(suffix, <span slot='suffix' style="display: inline-block;position: relative; margin-left: 5px;">{suffix}</span>)}
        </span>)
    } else if(type==='textarea') {
      return (
        <el-input ref='input' value={value} onInput={onChange} type="textarea" rows={!itemConfig.autoSize && 4} autosize={itemConfig.autoSize} 
          placeholder={itemConfig.placeholder || ('请输入'+itemConfig.label)} disabled={disabled} readOnly={viewOnly} />
      )
    } else if(type === 'radioOne'){
      const { NLabel: N, YLabel: Y} = itemConfig;
      return (
        <RadioOneItem value={value} label={[Y,N].join('|')} disabled={itemConfig.disabled} onChange={onChange}></RadioOneItem>
      )
    } else if(type === 'radio'){
      return (
        <RadioItem value={value} options={itemConfig.options} disabled={itemConfig.disabled} onChange={onChange}></RadioItem>
      )
    } else if(type === 'address') {
      // console.log('AaddressItem', form)
      // debugger
      return (
        <AddressItem value={form} itemConfig={itemConfig} disabled={itemConfig.disabled} viewOnly={viewOnly} props={itemConfig.props} onChange={onChange}/>
      )
    } else if(type === 'cascader') {
      return (
        <CascaderItem itemConfig={itemConfig} value={form} onChange={onChange} />
      )
    }
  }
})