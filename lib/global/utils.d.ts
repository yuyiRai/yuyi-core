import { IUtils } from '../utils/Utils';
declare global {
    var Utils: IUtils;
    interface Window {
        Utils: IUtils;
    }
}
