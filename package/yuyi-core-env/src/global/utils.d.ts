import { IUtils } from '@/utils';
import { keys as Keys } from 'ts-transformer-keys';
import { oc as Oc } from 'ts-optchain';
declare global {
    var Utils: IUtils;
    var keys: typeof Keys;
    var oc: typeof Oc;
    interface Window {
        Utils: IUtils;
        keys: typeof Keys;
        oc: typeof Oc;
    }
}
