/* eslint-disable */
import Item from '@/components/FormPage/FormItem.vue'
import Vue from 'vue'
import { DateUtils } from '../../FormPage/input-Item/DatePickerItem.js'
import { dateFormat } from '../../../filters'

export default class FilterHeadUtil {

    filtedValue = {};
    enabledFilter = false;
    itemConfig = {};
    $emit = null;
    constructor(onFilterFunc, itemConfig) {
        this.filtedValue = {}
        this.itemConfig = itemConfig;
        this.$emit = onFilterFunc
    }

    renderFilter = (h, { column, $index }, { i, onItemChange, isFilterEnabled, valid, clear = (()=>this.currentValue=undefined) }) => {
        const onClick = (e) => e.stopPropagation()
        const onSearch = (e) => {
            this.enabledFilter = (isFilterEnabled || (()=>this.currentValue!=null) )()
            // console.log(this.filtedValue,this.currentValue)
            _.forEach(Object.keys(this.filtedValue), (key)=>{
                const i = this.filtedValue[key]
                this.filtedValue[key] = _.isDate(i)?dateFormat(i, 'yyyy-MM-dd HH:mm:ss'):i
            })
            this.$emit(i.code, this.filtedValue, this.currentValue);
        }
        const onReset = (e) => {
            if(this.enabledFilter) {
                this.enabledFilter = false;
                this.filtedValue = {};
                // Object.keys(this.filterValue).forEach(key=>Vue.prototype.$set(filterValue,key,null))
                this.$emit(i.code, {}, this.currentValue);
            }
        }
        const style = this.enabledFilter ? {} : { color: '#999'};
        return (
            <el-popover placement="bottom" width={400} trigger="click">
              <el-row type='flex' align='middle'>
                <el-col span={ 16 }>
                    <el-form>
                        <el-row>
                            <Item form={this.filtedValue} i={{ col: 3, useLabel: false, ...Utils.isObjectFilter(i,{}) }} size='mini' 
                                onOnItemChange={ Utils.isFunctionFilter(onItemChange, ((code, currentValue)=>this.currentValue=currentValue)) } />
                        </el-row>
                    </el-form>
                </el-col>
                <el-col span={ 4 }><el-button type='primary' size='mini' onClick={onSearch}>确认</el-button></el-col>
                <el-col span={ 4 }><el-button type='primary' size='mini' onClick={onReset}>重置</el-button></el-col>
              </el-row>
              <el-button slot='reference' type='text' style={ style } onClick={ onClick }>
                <b>{this.itemConfig.label}</b><i class='el-icon-search' />
              </el-button>
            </el-popover>
        )
    }

    renderFilterSearch = (h, { column, $index }) => {
        return this.renderFilter(h, { column, $index }, {
            i: { label: this.itemConfig.label, code: this.itemConfig.name }
        })
    }

    renderFilterDateTitle = (h, { column, $index }) => {
        return this.renderFilter(h, { column, $index }, {
            i: { label: this.itemConfig.label, code: `${this.itemConfig.name}Start|${this.itemConfig.name}End`, type: "dateToDate", value: DateUtils.getDateRange(7) },
            valid: (value) => { },
            isFilterEnabled: () => {
                const [ start, end ] = Utils.isArrayFilter(this.currentValue, ['', ''])
                return start != '' && end != ''
            },
            clear: () => this.currentValue = [undefined, undefined]
        })
    }
}

