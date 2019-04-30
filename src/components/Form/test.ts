import { Utils } from '../../utils';
export class AppStore {
  constructor() {
    Utils.observe(this.model, console.log as any)
  }
  @Utils.observable.shallow list = Utils.observable.array([]); 
  @Utils.observable model = {}
  @Utils.computed get displayList(){
    return this.list.map(i => ({i}))
  }
  @Utils.computed.struct get first(){
    console.log('get first')
    return this.displayList[0]
  }
  @Utils.computed.struct get second(){
    console.log('get second')
    return this.displayList[1]
  }
  @Utils.action.bound push(i) {
    this.list.push(i)
  }
  watch = (model = this.model) => {
    return model[123]
  }
}
(window as any).AppStore = AppStore;
(window as any).appstore = new AppStore()