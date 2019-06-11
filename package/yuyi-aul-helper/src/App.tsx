import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'antd/dist/antd.css';
import { Upload, Icon, message } from 'antd';
import * as INI from 'js-ini'
import { ExoUtils } from './ExoUtils'

const Dragger = Upload.Dragger;

const props = {
  name: 'file',
  multiple: true,
  showUploadList: false,
  accept: '.json,,txt,.exo',
  beforeUpload: (file: File, fileList: File[]) => {
    console.log(file, fileList)
    message.success(`${file.name} file uploaded successfully.`);
    const fileReader = new FileReader();
    //载入文件
    fileReader.readAsText(file, 'Shift-JIS');
    //文件载入成功
    fileReader.onload = () => {
      //取到文件结果，就可以它了
      const fileResult = fileReader.result;
      console.log(new ExoUtils(fileResult as string))
    }
    return false
  },
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

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
        <div>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibit from uploading company data or other
              band files
            </p>
          </Dragger>
        </div>
      </header>
    </div>
  );
}

export default App;
