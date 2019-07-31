export declare type ParamFirst<T> = T extends ((a: infer P, ...args: any[]) => any) ? P : never;
export declare type ParamSecond<T> = T extends ((a: any, b: infer P, ...args: any[]) => any) ? P : never;
//# sourceMappingURL=TypescriptUtils.d.ts.map