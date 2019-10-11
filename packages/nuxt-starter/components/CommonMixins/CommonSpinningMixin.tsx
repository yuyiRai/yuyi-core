import { convertArr2Map } from '@/utils/CommonUtils';
import { Component, Watch } from 'vue-property-decorator';
import SimpleSpinningMixin, { ISimpleSpinningMixinProps } from './SimpleSpinningMixin';

export interface ICommonSpinningMixinProps extends ISimpleSpinningMixinProps {

}

@Component({})
export class CommonSpinningMixin extends SimpleSpinningMixin implements ICommonSpinningMixinProps {
  @Watch('actionSpinning', { immediate: true })
  protected onActionSpinningChanged(spinning: boolean) {
    this.toggleSpinning(spinning);
  }
  public spinningActionMap: {
    [name: string]: boolean;
  } = {};
  /** 不会进入spinning识别的code */
  public spinningWhiteList?: string[];
  public get spinningWhiteMap() {
    return this.spinningWhiteList && convertArr2Map(this.spinningWhiteList) || {};
  }
  public isActionSpinning(actionName: string, strict = false) {
    return this.spinningActionMap[actionName] || (!strict && this.spinningActionMap[actionName]);
  }
  public get spinningAction(): string[] {
    const r = [];
    for (const [name, loading] of Object.entries(this.spinningActionMap)) {
      loading && r.push(name);
    }
    return r;
  }
  public get actionSpinning() {
    return this.spinningAction.length > this.actionSpinningThreshold;
  }

  private actionSpinningThreshold = 0

  /**
   * 设置整体spinning的阈值，当有超过这个数字的action处于spinning状态中时才会切换整体spinning
   * @param thresold 默认值为0
   * @public
   */
  public setActionSpinningThreshold(thresold: number = 0) {
    this.actionSpinningThreshold = thresold
  }

  public get isSpinning() {
    return this.actionSpinning || this.localSpinning;
  }
  public spinningStart(name: string) {
    if (!this.spinningWhiteList || !this.spinningWhiteMap[name]) {
      this.spinningActionMap[name] = true;
      this.spinningActionMap = { ...this.spinningActionMap };
    }
  }
  public spinningEnd(name: string) {
    if (this.spinningActionMap[name]) {
      this.spinningActionMap[name] = false;
    }
  }
}
export default CommonSpinningMixin
