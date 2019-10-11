import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

export interface ISimpleSpinningMixinProps extends Pick<SimpleSpinningMixin, 'spinning'> {
}

@Component({})
export class SimpleSpinningMixin extends Vue {
  /**
   * 展示加载中标志
   * @displayName spinning
   * @model .sync
   */
  @Prop({ type: Boolean, default: false })
  public spinning?: boolean;

  protected localSpinning = false;
  @Watch('spinning', { immediate: true })
  protected onSpinningPropReceive(spinning: boolean) {
    if (spinning !== this.localSpinning) {
      this.localSpinning = spinning;
    }
  }

  @Watch('localSpinning', { immediate: true })
  protected onSpinningChanged(spinning: boolean) {
    /**
     * 更新加载中标志状态
     * @type { boolean }
     */
    this.$emit('update:spinning', spinning)
  }

  public toggleSpinning(spinning: boolean) {
    this.localSpinning = spinning
  }
}
// console.log(SimpleSpinningMixin)
export default SimpleSpinningMixin
