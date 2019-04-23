/* eslint-disable */
import { Component, Inject, Prop, Vue, Watch } from 'vue-property-decorator';
import { Observer } from 'mobx-vue'
import './SelectAndSearchItem.scss'
import { SelectAndSearchStore } from './SelectAndSearchStore';
import { values } from 'mobx';
import { ItemConfig } from './ItemConfig';

@Observer
@Component({ name: 'CascaderItem' })
export class CascaderItem extends Vue {
  @Prop({type: String}) value
  @Prop({type: ItemConfig}) itemConfig;
}