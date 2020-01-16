import { Constant$ } from '../Constransts';
import { simpleTimeBufferInput } from '../TimeBuffer';
var { V, C, W, G } = Constant$.DefPropDec$$
/**
 *
 * @param { number } time
 */
export function timebuffer(time: number, mode = 'last') {
  return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
    var func: Function = target[methodName];
    var methodKey = Constant$.KEY_PREFIX_INJECT + methodName;
    var methodTmpKey = methodKey + '2';
    delete descriptor[V];
    delete descriptor[W];
    Constant$.OBJ_ASSIGN(descriptor, {
      [C]: false,
      [G]: function () {
        var THIS = this;
        if (!THIS[methodKey]) {
          THIS[methodTmpKey] = func.bind(THIS);
          THIS[methodKey] = (...args: any[]) => {
            // console.log(methodName + 'Tmp', args)
            return simpleTimeBufferInput(THIS[methodTmpKey], args, (argsList) => {
              const todoArgs = argsList[argsList.length - 1];
              // console.log(todoArgs, argsList)
              return THIS[methodTmpKey](...todoArgs);
            }, time);
          };
        }
        return THIS[methodKey];
      },
    });
    // console.log(descriptor)
  };
}
