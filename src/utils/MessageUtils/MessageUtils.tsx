import { Message } from 'element-react';
import { assign, concat, join, reduce } from 'lodash';
import Utils from "..";

export interface IMessageConfig<T = any> {
  msg?: T;
  [k: string]: any;
}
export interface IMessageConfigGroup<T = any>{
  msg: T[];
  [k: string]: any;
}


export function $message<T = any>(config: IMessageConfig<T>, instance: any, time: number = 100): Promise<T[]> {
  return Utils.simpleTimeBufferInput(instance, config, (configList: IMessageConfig<T>[]) => {
    const config: IMessageConfigGroup = reduce<any, IMessageConfigGroup>(configList, ({ message, ...other }, { msg: iMsg, ...iOther }) => {
      return assign(other, iOther, {
        message: concat(message, [iMsg]),
        dangerouslyUseHTMLString: true,
      });
    }, { msg: [] });
    Message({ ...config, message: join(Array.from(new Set(config.msg)), '<br />') });
  }, time || 100);
}

$message.error = function(msg: any, instance?: any, time?: number) {
  return $message({ msg, type: 'error' }, instance);
};


