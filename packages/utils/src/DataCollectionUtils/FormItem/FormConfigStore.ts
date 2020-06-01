import { DataTransformer } from '../Transformer';

export interface IFormItem {
  /** 数据集中的key */
  code: string;

  /** 默认值，可以为函数 */
  value?: any;
  /** 
   * @see {@link IFormItem.value}
   * @deprecated
   */
  defaultValue?: any;

}


export class FormDataTransformer<TItemConfig extends IFormItem, TInnerData extends object, TOuterData extends object> {

  transformer: DataTransformer<TInnerData, TOuterData>;
  private itemConfigs: TItemConfig[]

  static transformer = DataTransformer;

  public configItems(configList: TItemConfig[], filterList = [], codeList = configList.map(item => item.code)) {
    this.itemConfigs = configList;
    this.transformer = new DataTransformer(filterList, codeList);
  }

  transformFromData(outerData: TOuterData) {
    return this.transformer.fromTransform(outerData, {
      catchInvaildKey: true
    })
  }
  transformToData(interData: TInnerData) {
    return this.transformer.toTransform(interData, {
      catchInvaildKey: true
    });
  }
}
