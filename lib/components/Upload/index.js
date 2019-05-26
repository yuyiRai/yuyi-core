import React from 'react';
import UploadMessage, { UploadProgressStore } from './UploadMessage';
import Utils from '../../utils';
export function showUploadMessage(instance, file, store) {
    return Utils.$notify({
        duration: 0,
        placement: 'bottomLeft',
        title: "\u4E0A\u4F20\u4E2D",
        type: 'success',
        style: {
            'zIndex': 2048
        },
        msg: function (index) { return React.createElement(UploadMessage, { key: index, file: file, store: store }); }
    }, instance);
}
export { UploadMessage, UploadProgressStore };
//# sourceMappingURL=index.js.map