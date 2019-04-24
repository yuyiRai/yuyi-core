import { ArgsProps, NotificationPlacement, IconType } from 'antd/lib/notification';
import 'antd/lib/notification/style/css';
import React from 'react';
export declare class NotificationStore {
    key: string;
    constructor(props: ArgsProps);
    close(): void;
}
export interface IMessageConfig<T = any> {
    msg?: T;
    [k: string]: any;
}
export interface IMessageConfigGroup<T = any> {
    msg: T[];
    [k: string]: any;
}
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
export declare function $message<T = any>(config: IMessageConfig<T>, instance: any, time?: number): Promise<T[]>;
export declare namespace $message {
    var error: (msg: any, instance?: any, time?: number) => Promise<any[]>;
}
export declare function $notify<V = any>(config: INotificationStoreConfig<V>, instance: any, time?: number): Promise<NotificationStore>;
