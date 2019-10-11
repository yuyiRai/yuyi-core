import { Component, Prop, Vue } from 'vue-property-decorator';
import AutoOperationBar from '.';
import { IAutoOperationBarProps } from './interface';
import { VCProps } from '@/components/CommonFormBase';


export interface IAutoOperationBarInjectProps extends VCProps<AutoOperationBarInjectMixins> {
}

@Component({
  components: { AutoOperationBar } as any
})
export class AutoOperationBarInjectMixins extends Vue implements IAutoOperationBarInjectProps {
  /**
   * 配置操作栏按钮props
   * 参照组件AutoOperationBar
   */
  @Prop({ type: Object, default: null })
  public operation?: IAutoOperationBarProps;
  /**
   * AutoOperationBar的class
   */
  @Prop({ type: null, default: null })
  public operationClass?: any;

  /**
   * AutoOperationBar的style
   */
  @Prop({ type: null, default: null })
  public operationStyle?: any;

  protected get autoOperationListeners() {
    const keys = Object.keys(this.$listeners).filter(k => /^action\:/ig.test(k));
    // debugger
    return keys.reduce((o, k) => Object.assign(o, { [k.replace(/^action\:/ig, '')]: this.$listeners[k] }), {});
  }
}

export default AutoOperationBarInjectMixins
