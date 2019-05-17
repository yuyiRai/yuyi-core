/* eslint-disable */
import { observable, computed, action, IKeyValueMap } from 'mobx';
import Utils from '../../utils';
import { IItemConfig, ComputedPropertyCreater, ComputedPick } from './interface';
export interface IDisplayConfigCreater<FM> {
  inline?: ComputedPropertyCreater<boolean, FM>;
  isViewOnly?: ComputedPropertyCreater<boolean, FM>;
  showMessage?: ComputedPropertyCreater<boolean, FM>;
  textAlign?: ComputedPropertyCreater<'center' | 'left' | 'right', FM>;
  size?: ComputedPropertyCreater<boolean, FM>;
  col?: ComputedPropertyCreater<number, FM>;
  offset?: ComputedPropertyCreater<number, FM>;
  offectRight?: ComputedPropertyCreater<number, FM>;
  prefix?: ComputedPropertyCreater<any, FM>;
  suffix?: ComputedPropertyCreater<any, FM>;
  height?: ComputedPropertyCreater<string, FM>;
  useLabel?: ComputedPropertyCreater<boolean, FM>;
}
export interface IDisplayConfig<FM> extends ComputedPick<IDisplayConfigCreater<FM>, FM> {
}

export class DisplayConfig {
  @observable itemConfig: IItemConfig
  @observable.ref props: IKeyValueMap
  
  @action init(itemConfig: IItemConfig, props: IKeyValueMap){
    this.itemConfig = itemConfig;
    this.props = props;
    return this;
  }
  @computed get isInlineMessage() {
    return this.itemConfig.inline || this.itemConfig.name === this.itemConfig.code
  }
  @computed get isShowMessage() {
    return !this.itemConfig.isViewOnly && ![this.itemConfig.showMessage, this.props.showMessage].some(i => i === false)
  }
  @computed get textAlign() {
    return Utils.isStringFilter(this.itemConfig.textAlign, this.props.textAlign)
  }
  @computed get isDisabled() {
    return this.props.disabled || this.itemConfig.disabled
  }
  @computed.struct get showSize() {
    return this.props.size || this.itemConfig.size
  }
  @computed get label() {
    const { useLabel, label } = this.itemConfig
    if (useLabel == false || label == undefined)
      return undefined
    return label + (this.itemConfig.isViewOnly ? ":" : "")
  }
  @computed get coltal() {
    return 24 / (this.props.columnCount || 3)
  }
  @computed get colSpan() {
    return Math.round(((this.itemConfig.col || 1) + (this.itemConfig.offectRight || 0) / 8) * this.coltal)
  }
  @computed.struct get formItemStyle() {
    // trace()
    const { colSpan, itemConfig, showSize: viewSize, textAlign } = this;
    return {
      width: `${(colSpan-(itemConfig.offectRight))/colSpan*100}%`,
      height: `${itemConfig.height}`,
      marginBottom: viewSize == "mini" ? 0 : undefined,
      textAlign
    }
  }
  @computed get prefix() {
    return this.itemConfig.prefix
  }
  @computed get suffix() {
    return this.itemConfig.suffix
  }
  @computed get useColumn() {
    return this.props.useColumn
  }
}