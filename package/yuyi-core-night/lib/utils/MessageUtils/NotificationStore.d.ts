import { ArgsProps, IconType, NotificationPlacement } from 'antd/lib/notification';
import 'antd/lib/notification/style/css';
import React from 'react';
export declare const YuyiContainer: any;
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
export declare function $notify<V = any>(config: INotificationStoreConfig<V>, instance: any, time?: number): Promise<NotificationStore>;
export declare class NotificationStore {
    static container: HTMLDivElement;
    key: string;
    static inited: boolean;
    constructor(props: ArgsProps);
    open: (args: ArgsProps) => void;
    close(): void;
    destroy(): void;
    prepare(): void;
    static init(container: HTMLDivElement): void;
}
