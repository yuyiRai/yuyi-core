import Notification, { ArgsProps, IconType, NotificationPlacement } from 'antd/lib/notification';
import 'antd/lib/notification/style/css';
import './Notification'
import { assign, concat, reduce } from 'lodash';
import React from 'react';
import Utils from "..";

export interface INotificationStoreConfigBase {
  title?: React.ReactNode;
  message?: React.ReactNode;
  btn?: React.ReactNode;
  key?: string;
  onClose?: () => void;
  duration?: number | null;
  icon?: React.ReactNode;
  placement?: NotificationPlacement;
  style?: React.CSSProperties;
  prefixCls?: string;
  className?: string;
  readonly type?: IconType;
  onClick?: () => void;
}
export interface INotificationStoreConfig<T = any> extends INotificationStoreConfigBase {
  msg?: T;
}
export interface INotificationStoreConfigGroup<T = any> extends INotificationStoreConfigBase {
  msg: T[];
}
export function $notify<V = any>(config: INotificationStoreConfig<V>, instance: any, time: number = 100): Promise<NotificationStore> {
  return Utils.simpleTimeBufferInput(instance, config, function (configList: INotificationStoreConfig<V>[]): NotificationStore {

    const { msg, ...config }: INotificationStoreConfigGroup = reduce<any, any>(
      configList,
      ({ msg, ...other }, { msg: iMsg, ...iOther }) => {
        return assign(other, iOther, {
          msg: concat(msg, [iMsg]),
          dangerouslyUseHTMLString: true,
        });
      },
      { msg: [] }
    );

    const message = reduce(
      Array.from(new Set(msg)),
      (c, domGetter, index, list) =>
        [...c, c.length > 0 && <br key={index + list.length + 1} />, Utils.isFunction(domGetter) ? domGetter(index, list) : domGetter],
      []
    );

    const instance = new NotificationStore({
      key: Utils.uuid(),
      ...config,
      ...(config.title ? { message: config.title, description: <span>{message}</span> } : { message: <span>{message}</span> })
    });
    // console.error(message, instance);
    return instance;
  }, time || 100);
}

export class NotificationStore {
  key: string;
  constructor(props: ArgsProps) {
    this.key = props.key;
    Notification.open(props);
  }
  close() {
    Notification.close(this.key);
  }
  destroy() {
    Notification.destroy()
  }
}