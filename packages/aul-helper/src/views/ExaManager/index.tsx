import { Button } from 'antd';
import { Observer } from '@yuyi/night';
import * as React from 'react';
import { AppContext } from '../../App';
import DragUpload, { Upload } from '../../components/DragUpload';
import '../../DAT';

interface IExaManagerProps {
}

const ExaManager: React.FunctionComponent<IExaManagerProps> = (props) => {

  const store = React.useContext(AppContext)
  const onFileLoaded = React.useCallback(async (fileStr) => {
    store.exoUtils.readFile(fileStr)
    await store.storeSnapshot()
  }, [store])
  const { exoUtils } = store
  React.useEffect(() => {
    console.error(exoUtils)
  }, [exoUtils])
  return (
    <div>
      <Observer>{() => <div>version: {store.trackStore.version}</div>}</Observer>
      <Observer>{() => <span>{exoUtils.target.length}</span>}</Observer>
      <DragUpload acceptList={['.exo', '.exa']} fileLoader={store.fileLoader} onFileLoaded={onFileLoaded}></DragUpload>
      <Upload acceptList={['.txt']} fileLoader={store.fileLoader} />
      <DragUpload fileLoader={store.fileLoader} directory showUploadList={true} text='123'></DragUpload>
      <Button onClick={() => console.error('plus', store.plus(), store.storeSnapshot())}>plus</Button>
      <Button onClick={() => console.error('snap', store.snap())}>getSnapshot</Button>
      <Button onClick={() => console.error('snap', store.clearSnapshot())}>clear</Button>
      <Button onClick={() => console.error('snap', store.clearSnapshot(true), store)}>force clear</Button>
    </div>
  );
};

export default ExaManager;