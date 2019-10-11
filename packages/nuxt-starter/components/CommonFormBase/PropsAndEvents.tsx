import { Component } from 'vue-property-decorator';
import CommonFormBaseProps from './Props';


export * from './Props';

@Component({})
export class CommonFormPropsAndEvent<InputForm = any, OutputForm = any> extends CommonFormBaseProps<OutputForm> {

  onChange(submitData: OutputForm, inputData: InputForm) {
    /**
     * 向上传递表单事件
     * 第一个为输出使用的数据类型的集合，第二个为实际组件使用的数据类型的集合
     * @type { OutputForm, InputForm }
     */
    this.$emit('change', submitData, inputData);
    this._onChange(submitData, inputData)
  }
  _onChange(submitData: OutputForm, inputData: InputForm) {
    /**
     * @see change
     * @deprecated 
     * @type { OutputForm, InputForm }
     */
    this.$emit('submitData:update', submitData, inputData);
  }

}

export default CommonFormPropsAndEvent
