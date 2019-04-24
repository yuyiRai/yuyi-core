import { ItemConfig } from "./ItemConfig";
import { AsyncPropertyGetter } from "../../utils";

export function FormItemOptions() {
  
  var i = {
    code: 'value', nameCode: 'name', remoteMethod(key) {
      return new Promise(r => {
        setTimeout(() => {
			console.log('key', key)
			r(({ r1: [1, 2, 3, 4], r2: [5, 1, 2, 3, 4] })[key])
		}, 100)
      })
    }
  };
  var form = { value: 1, name: 'r1' }
  var config = new ItemConfig(i, form, {})
  config.remoteOptions
  Reflect.get(config, 'remoteOptions', new AsyncPropertyGetter())

  setTimeout(() => {
    form.name = 'r2'
    config.remoteOptions
  }, 1000);
}