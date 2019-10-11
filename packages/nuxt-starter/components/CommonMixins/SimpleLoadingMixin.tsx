import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { Spin } from 'ant-design-vue';

export interface ISimpleLoadingMixinProps extends Pick<SimpleLoadingMixin, 'loading'> {
}

@Component({})
export class SimpleLoadingMixin extends Vue {
  /**
   * 展示加载中标志
   * @displayName loading
   * @model .sync
   */
  @Prop({ type: Boolean, default: false })
  public loading?: boolean | Spin;

  protected localLoading?: boolean = false;
  @Watch('loading', { immediate: true })
  protected onSpinningPropReceive(loading: boolean) {
    if (loading !== this.localLoading) {
      this.localLoading = loading;
    }
  }

  @Watch('localLoading', { immediate: true })
  protected onSpinningChanged?(loading: boolean): void {
    this.toggleSpinning
    /**
     * 更新加载中标志状态
     * @type { boolean }
     */
    this.$emit('update:loading', loading)
  }

  public toggleSpinning?(loading: boolean) {
    this.localLoading = loading
  }
}
export default SimpleLoadingMixin
