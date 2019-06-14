import { Icon, message, Upload } from 'antd';
import { UploadProps } from 'antd/lib/upload';
import * as React from 'react';
import styled from 'styled-components';

interface IDragUploadProps extends UploadProps {
  text?: string;
  hint?: string;
  onFileLoaded?: (string: string) => void
}

const Dragger = Upload.Dragger;


export const StyledDragger = styled(Dragger)`
  & > .ant-upload-drag {
    min-width: 200px;
  }
`

const propsBase = {
  name: 'file',
  multiple: true,
  showUploadList: false,
  accept: '.json,,txt,.exo',
  // onChange(info: any) {
  //   const status = info.file.status;
  //   if (status !== 'uploading') {
  //     console.log(info.file, info.fileList);
  //   }
  //   if (status === 'done') {
  //     message.success(`${info.file.name} file uploaded successfully.`);
  //   } else if (status === 'error') {
  //     message.error(`${info.file.name} file upload failed.`);
  //   }
  // },
};

export const DragUpload: React.FunctionComponent<IDragUploadProps> = React.memo(
  ({ text, hint = '拖曳文件到该区域上传', ...props }) => {
    const beforeUpload = React.useCallback(
      (file: File, fileList: File[]) => {
        console.log(file, fileList)
        message.success(`${file.name} file uploaded successfully.`);
        const fileReader = new FileReader();
        //载入文件
        fileReader.readAsText(file, 'Shift-JIS');
        //文件载入成功
        fileReader.onload = () => {
          //取到文件结果，就可以它了
          const fileResult = fileReader.result;
          console.log(props)
          props.onFileLoaded && props.onFileLoaded(fileResult as string)
        }
        return false
      }, [props.onFileLoaded])
    return (
      <StyledDragger {...propsBase} {...props} beforeUpload={beforeUpload}>
        <p className="ant-upload-drag-icon">
          <Icon type="inbox" />
        </p>
        <p className="ant-upload-text">{text}</p>
        <p className="ant-upload-hint">
          {hint}
        </p>
      </StyledDragger>
    );
  });

export default DragUpload;