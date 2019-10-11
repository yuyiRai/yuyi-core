import FilterCodeListProps, { CodeFilterPropsMixins } from '../CodeFilterPropsMixins';
import Component, { mixins } from 'vue-class-component';

const Extend = CodeFilterPropsMixins('actionNameList')
@Component({})
export default class extends mixins(FilterCodeListProps, Extend) {

}