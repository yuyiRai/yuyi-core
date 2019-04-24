/// <reference types="react" />
import UploadMessage, { UploadProgressStore } from './UploadMessage';
export declare function showUploadMessage(instance: any, file: any, store: UploadProgressStore): Promise<((index: number) => JSX.Element)[]>;
export { UploadMessage, UploadProgressStore };
