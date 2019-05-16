/* eslint-disable */
import { observable, computed, action, IKeyValueMap } from 'mobx';
import Utils from '../../utils';
import { IItemConfig, ComputedProperty } from './interface';
export interface IDisplayConfigConstructor<FM> {
  inline?: ComputedProperty<boolean, FM>;
  isViewOnly?: ComputedProperty<boolean, FM>;
  showMessage?: ComputedProperty<boolean, FM>;
  textAlign?: ComputedProperty<'center' | 'left' | 'right', FM>;
  disabled?: ComputedProperty<boolean, FM>;
  size?: ComputedProperty<boolean, FM>;
  col?: ComputedProperty<number, FM>;
  offset?: ComputedProperty<number, FM>;
  offectRight?: ComputedProperty<number, FM>;
  prefix?: ComputedProperty<any, FM>;
  suffix?: ComputedProperty<any, FM>;
  height?: ComputedProperty<string, FM>;
  useLabel?: ComputedProperty<boolean, FM>;
}
export interface IDisplayConfig {
  inline?: boolean;
  isViewOnly?: boolean;
  showMessage?: boolean;
  textAlign?: 'center' | 'left' | 'right';
  disabled?: boolean;
  size?: boolean;
  col?: number;
  offset?: number;
  offectRight?: number;
  prefix?: any;
  suffix?: any;
  height?: string;
  useLabel?: boolean;
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