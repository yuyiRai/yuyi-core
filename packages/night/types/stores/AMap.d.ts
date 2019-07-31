export declare type IAMapKey = 'Map' | '';
export declare class AMapService {
    static amap: any;
    static key: string;
    static setKey(key: string): void;
    static AMap(key?: string): Promise<any>;
    mapLoading: boolean;
    constructor();
    /**
     * @returns 插件名字集合
     */
    pluginNames(): Array<string>;
    /**
     * 插件集合
     */
    plugin: {
        'ToolBar': (map: any) => void;
        /**
         * 自动搜索补全地名
         * @returns 返回一个promise
         */
        'Autocomplete': (map: any, city: string, search: string) => Promise<any[]>;
        'Geolocation': (map: any) => void;
    };
    private autocomplete;
    getAutoComplete: (value: any) => Promise<any>;
    /**
     *
     * @param { number } zoom 地图缩放率
     */
    onMapLoad(zoom: number): Promise<any>;
    getMap(): Promise<any>;
    dispose(): void;
}
//# sourceMappingURL=AMap.d.ts.map