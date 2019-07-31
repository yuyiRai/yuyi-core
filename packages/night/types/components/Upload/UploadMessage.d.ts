export declare class UploadProgressStore {
    persent: number;
    setPersent(p: number): void;
    readonly progressText: string;
}
export declare const UploadMessage: ({ store, file }: {
    store: UploadProgressStore;
    file: any;
}) => JSX.Element;
export default UploadMessage;
//# sourceMappingURL=UploadMessage.d.ts.map