/* eslint-disable */
import { convertArr2Map } from '@/utils/CommonUtils';
import { VueConstructor } from 'vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
class FilterCodeListProps extends Vue {
  /**
   * 显示指定展示的Key
   */
  @Prop({ type: Array })
  display?: string[];
  /**
   * 显示指定隐藏的Key(优先级高于display)
   */
  @Prop({ type: Array })
  hidden?: string[];
}

export function CodeFilterPropsMixins<K extends string>(allCodeListPropertyName: K) {
  @Component({
    data() {
      return {
        // [allCodeListPropertyName]: []
      }
    }
  })
  class FilterCodeList extends FilterCodeListProps {
    get localDisplayMap() {
      // console.log(this)
      const display = this.display && this.display.length > 0 ? this.display : (this[allCodeListPropertyName as string] as any[]);
      const display2 = this.hidden && this.hidden.length > 0 ? display.filter(d => !this.hidden.includes(d)) : display;
      return convertArr2Map(display2);
    }
  }
  return FilterCodeList as VueConstructor<Vue & {
    [T in (keyof FilterCodeList | K)]?: T extends keyof FilterCodeList ? FilterCodeList[T] : any[]
  }>
}

console.log(CodeFilterPropsMixins)
export default FilterCodeListProps;
