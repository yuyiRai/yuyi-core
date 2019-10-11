
export type ParamFirst<T> = T extends ((a: infer P, ...args: any[]) => any) ? P : never
export type ParamSecond<T> = T extends ((a: any, b: infer P, ...args: any[]) => any) ? P : never
export type ParamThird<T> = T extends ((a: any, b: any, c: infer P, ...args: any[]) => any) ? P : never
export type ParamExcludeSecond<T> = T extends ((a: any, b: any, ...c: infer P) => any) ? P : never