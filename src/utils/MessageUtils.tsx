import { Message, Notification } from 'element-react';
import { assign, concat, join, reduce } from 'lodash';
import React from 'react';
import Utils from ".";

export interface IMessageConfig<T = any> {
  msg?: T;
  [k: string]: any;
}
export interface IMessageConfigGroup<T = any> {
  msg: T[];
  [k: string]: any;
}
export function $message<T = any>(config: IMessageConfig<T>, instance: any, time: number = 100): Promise<T[]> {
  return Utils.simpleTimeBufferInput(instance, config, (configList: IMessageConfig<T>[]) => {
    const config: IMessageConfigGroup = reduce<IMessageConfig, IMessageConfigGroup>(configList, ({ msg, ...other }, { msg: iMsg, ...iOther }) => {
      return assign(other, iOther, {
        msg: concat(msg, [iMsg]),
        dangerouslyUseHTMLString: true,
      });
    }, { msg: [] });
    Message({ ...config, message: join(Array.from(new Set(config.msg)), '<br />') });
  }, time || 100);
}

$message.error = function(msg: any, instance?: any, time?: number) {
  return $message({ msg, type: 'error' }, instance);
};

export function $notify<V = any>(config: IMessageConfig<V>, instance: any, time: number = 100): Promise<V[]> {
  return Utils.simpleTimeBufferInput(instance, config, function (configList: IMessageConfig<V>[]) {
    const config: IMessageConfigGroup = reduce<any, any>(configList, ({ msg, ...other }, { msg: iMsg, ...iOther }) => {
      return assign(other, iOther, {
        msg: concat(msg, [iMsg]),
        dangerouslyUseHTMLString: true,
      });
    }, { msg: [] });
    const message = reduce(Array.from(new Set(config.msg)), (c, domGetter, index, list) => [...c, c.length > 0 && <br />, Utils.isFunction(domGetter) ? domGetter(index, list) : domGetter], [])
    const instance = Notification({
      ...config,
      message: <span>{message}</span>
    }, 'success');
    console.error(message, instance)
    return instance
  }, time || 100);
}