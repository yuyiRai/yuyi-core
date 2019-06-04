import 'element-ui/lib/theme-chalk/message.css';
export interface IMessageConfig<T = any> {
    msg?: T;
    [k: string]: any;
}
export interface IMessageConfigGroup<T = any> {
    msg: T[];
    [k: string]: any;
}
declare function $message<T = any>(config: IMessageConfig<T>, instance?: any, time?: number): Promise<T[]>;
declare namespace $message {
    var error: (msg: any, instance?: any, time?: number) => Promise<any[]>;
}
export default $message;
