import { message, Upload as UploadBase } from 'antd';
import { UploadProps } from 'antd/lib/upload';
import { action, computed, observable, ObservableMap, toJS } from 'mobx';
import { useAsObservableSource, useObserver } from '@yuyi/night';
import * as React from 'react';
import styled from 'styled-components';
import { createSimpleTimeBufferInput } from '@yuyi919/utils';
import { Button, Tooltip } from '@material-ui/core';
import AutoIcon from './AutoIcon';
import { Store } from 'mmlpx';

const textFileType = ['.json', '.txt', '.exo', '.exa']
const textFileNameRegexp = new RegExp(`(${textFileType.join('|')})$`)
const fileTypeMap = {
  text: 'text/plain',
  wav: 'audio/wav'
}
interface IUploadProps extends UploadProps {
  text?: string;
  hint?: string;
  icon?: string | React.ReactElement;
  fileLoader?: FileLoader;
  onFileLoaded?: (string: string) => void
  acceptList?: string[]
}

const Dragger = UploadBase.Dragger;


export const StyledDragger = styled(Dragger)`
  & > .ant-upload-drag {
    min-width: 200px;
  }
`

export function isTextFile(file: File) {
  return file.type === fileTypeMap.text || textFileNameRegexp.test(file.name)
}
export function isWavFile(file: File) {
  return file.type === fileTypeMap.wav || /.wav$/.test(file.name)
}

const propsBase = {
  name: 'file',
  multiple: true,
  showUploadList: false
  // onChange(info: any) {
  //   const status = info.file.status;
  //   if (status !== 'uploading') {
  //     console.error(info.file, info.fileList);
  //   }
  //   if (status === 'done') {
  //     message.success(`${info.file.name} file uploaded successfully.`);
  //   } else if (status === 'error') {
  //     message.error(`${info.file.name} file upload failed.`);
  //   }
  // },
};

export interface IFileLoaded {
  type: 'text' | 'wav' | 'other'
  name: string;
  content?: string;
  file: File;
}

@Store('FileLoader')
export class FileLoader {
  @observable fileList: File[] = observable.array([]);
  @observable.shallow fileLoadedMap: ObservableMap<File, IFileLoaded> = observable.map({})

  @computed.struct get fileLoaedList(): IFileLoaded[] {
    return Array.from(this.fileLoadedMap.values());
  }

  @computed.struct get fileLoaedListView(): IFileLoaded[] {
    return this.fileLoaedList.map(loaded => toJS(loaded));
  }

  @action loadStart(file: File) {
    this.fileList.push(file)
    return this;
  }
  @action loadEnd() {
    this.fileList = observable.array(this.fileList)
    return this;
  }

  @action async load(file: File): Promise<IFileLoaded> {
    if (isTextFile(file)) {
      if (this.fileLoadedMap.has(file)) {
        return this.fileLoadedMap.get(file)
      }
      const fileReader = new FileReader();
      //载入文件
      fileReader.readAsText(file, 'Shift-JIS');
      //文件载入成功
      return await new Promise((resolve, reject) => {
        fileReader.onload = action('fileReader#onload', () => {
          //取到文件结果，就可以它了
          const fileResult: string = fileReader.result as any;
          const response: IFileLoaded = {
            file,
            name: file.name,
            content: fileResult,
            type: "text"
          }
          this.fileLoadedMap.set(file as any, response)
          resolve(response)
        })
        fileReader.onerror = (e) => {
          reject(e)
        }
      })
    }
    return this.fileLoadedMap.set(file as any, {
      file,
      name: file.name,
      type: isWavFile(file) ? "wav" : "other"
    }).get(file)
  }
}

function useUpload(props: IUploadProps) {
  const store = useAsObservableSource(props.fileLoader || new FileLoader())
  const customRequest = React.useCallback((option) => {
    const { file } = option as { file: File }
    store.loadStart(file).load(file).then(createSimpleTimeBufferInput(resList => {
      message.success(`${resList.length} file uploaded successfully.`);
      resList.forEach(res => {
        props.onFileLoaded && props.onFileLoaded(res.content)
      })
      store.loadEnd()
      console.error(store);
    }, store, 200))
    option.onSuccess()
  }, [props, store])
  return { store, customRequest }
}

export const Upload: React.FunctionComponent<IUploadProps> = React.memo(
  ({ icon, directory, text, hint = `拖曳文件${directory ? '夹' : ''}到该区域上传`, ...props }) => {
    const { store, customRequest } = useUpload(props)
    return useObserver(() => (
      <UploadBase
        {...propsBase}
        {...props}
        accept={(props.acceptList ? props.acceptList.join(',') : '') + (props.accept || "")}
        directory={directory}
        fileList={store.fileList as any}
        customRequest={customRequest}
        showUploadList={false}
      >
        <Tooltip title={hint}>
          <Button>
            <AutoIcon type={icon || "upload"} />  {text || 'upload'}
          </Button>
        </Tooltip>
      </UploadBase>
    ));
  });

export const DragUpload: React.FunctionComponent<IUploadProps> = React.memo(
  ({ icon, directory, text, hint = `拖曳文件${directory ? '夹' : ''}到该区域上传`, ...props }) => {
    const { store, customRequest } = useUpload(props)
    return useObserver(() => (
      <StyledDragger
        {...propsBase}
        {...props}
        directory={directory}
        fileList={store.fileList as any}
        customRequest={customRequest}
        accept={(props.acceptList ? props.acceptList.join(',') : '') + (props.accept || "")}
        showUploadList={false}
      >
        <p className="ant-upload-drag-icon">
          <AutoIcon type={icon || "inbox"} />
        </p>
        <p className="ant-upload-text">{text}</p>
        <p className="ant-upload-hint">
          {hint}
        </p>
      </StyledDragger>
    ));
  });

export default DragUpload;