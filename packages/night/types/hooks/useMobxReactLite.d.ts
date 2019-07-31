import { useLocalStore as ul, useAsObservableSource as ua, Observer, observer, useObserver } from 'mobx-react-lite';
export declare const useLocalStore: typeof ul;
export declare function useActionObject<T extends object>(r: T): T;
export declare const useAsObservableSource: typeof ua;
export declare function usePostInit(block: () => unknown, name?: string): void;
export { useObserver, observer, Observer };
//# sourceMappingURL=useMobxReactLite.d.ts.map