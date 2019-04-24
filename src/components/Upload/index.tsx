import React from 'react'
import UploadMessage, { UploadProgressStore } from './UploadMessage'
import Utils from '../../utils';

export function showUploadMessage(instance: any, file: any, store: UploadProgressStore) {
  return Utils.$notify({
    duration: 0,
    position: 'bottom-left',
    title: `上传中`,
    type: 'success',
    msg: (index: number) => <UploadMessage key={index} file={file} store={store} />
  }, instance)
}

export {
  UploadMessage,
  UploadProgressStore
}