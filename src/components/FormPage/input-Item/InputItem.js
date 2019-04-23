/* eslint-disable */
import { Component, Inject, Prop, Vue, Watch } from 'vue-property-decorator';
import { Observer } from 'mobx-vue'

import { observable, action } from 'mobx';

export class TmpValueStore {
  @observable.ref tmpValue;
  @action.bound setTmpValue(value) {
    this.tmpValue = value
  }
}

@Observer
@Component({name: 'InputItem'})
export default class InputItem extends Vue {
  @Prop({ type: Object, required: true }) itemConfig
  @Prop({ }) value;
  @Prop({ type: Boolean, default: false  }) disabled

  store = new TmpValueStore()

  @Watch('value', {immediate:true})
  onNextValue(v, last) {
    if(!Utils.isEqual(v, last) && !Utils.isEqual(v, this.store.tmpValue)) {
      this.store.setTmpValue(v)
    }
  }
  created() {
    this.store.setTmpValue(this.value)
  }
  render(h) {
    const { disabled, itemConfig, onChange, suffix } = this;
    return (
      <elInput ref='input' value={this.store.tmpValue} validate-event={false} onInput={(v) => {
        this.store.setTmpValue(v)
        if(itemConfig.watchInput) {
          onChange(v)
        }
      }} onBlur={e=> !itemConfig.watchInput && onChange(this.store.tmpValue)} placeholder={itemConfig.placeholder || ('请输入'+itemConfig.label)} disabled={disabled} >
        <template slot='suffix'>{suffix}</template>
      </elInput>
    )
  }
  onChange(...args){
    this.$emit('change', ...args)
  }
}