import { AppendConfigPipeFunction, createPipe } from '@/components/CommonFormBase/interface';
import { castArray, isNotEmptyValue } from '@yuyi/utils';
import { Ellipsis } from '@/components'
import moment from 'moment';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { FormItem } from 'ant-design-vue/types/form/form-item';
import FormChildrenMixins from '../FormChildrenMixins';

@Component({
  name: 'ReadOnlyItem'
})
class ReadOnlyItem extends FormChildrenMixins {
  @Prop({ type: null })
  value: any;
  @Prop({ type: String })
  placeholder: any;
  @Prop({ type: Array })
  options: any;
  @Prop({ type: String })
  format: any;

  _formatter: any;
  // get options() {
  //   return utils.getOptions(config) || [];
  // }

  get optionsMap() {
    // if (this.options && this.options.length > 0) {
    //   console.log(this.options, this.value)
    // }
    return this.options.reduce((obj, o) => {
      return { ...obj, [o.value]: o.label };
    }, {});
  }
  mounted() {
    // console.log('this.mounted', this.value)
  }
  render(h) {
    // console.log(this.options)
    const v = this.formatter(h, this.value)
    const notNilValue = (isNotEmptyValue(v) && castArray(v).join(',')) || ''
    // console.log(notNilValue, v, this.value)
    // if (this.value === '0000000000') {
    //   debugger
    // }
    return <span><Ellipsis length={100}>{notNilValue.length > 0 ? notNilValue : this.isReadOnly ? '' : this.placeholder}</Ellipsis></span>;
  }

  get formatter() {
    return this._formatter && this._formatter.bind(this) || ((a, v) => {
      if (v instanceof moment) {
        return moment(v).format(this.format)
      }
      if (v instanceof Array && v.length > 0) {
        // debugger
        return v.map(v => this.optionsMap[v] || v)
      }
      return this.optionsMap[v] || v;
    })
  }
}
/**
 *
 * @param formatter - 原值映射到视图的方法
 */
export function useReadonly(
  formatter?: (h: any, value: any) => any
): AppendConfigPipeFunction<[any?], unknown, typeof FormItem> {
  /**
   *
   * @param  config
   * @param  utils
   */
  return function createReadonly(config) {
    return createPipe({
      component: Component({})(class ReadOnlyItemExtends extends ReadOnlyItem {
        _formatter = formatter
      }) as any,
      containerProps: {
        hasFeedback: false
      }
    })
  };
}

console.log(ReadOnlyItem)
export default ReadOnlyItem
