import { Button } from 'antd';
import { Observer, useComputed } from 'mobx-react-lite';
import * as React from 'react';
import { AppContext } from '../../App';
import DragUpload from '../../components/DragUpload';
import '../../DAT';

interface IExaManagerProps {
}

const ExaManager: React.FunctionComponent<IExaManagerProps> = (props) => {
  const store = React.useContext(AppContext)
  const { exoUtils } = store
  const onFileLoaded = React.useCallback(async (fileStr) => {
    exoUtils.readFile(fileStr)
    await store.storeSnapshot()
  }, [])
  React.useEffect(() => {
    console.log(exoUtils)
  }, [exoUtils])
  return (
    <div>
      <Observer>{() => <div>version: {store.trackStore.version}</div>}</Observer>
      <Observer>{() => <span>{ exoUtils.target.length}</span>}</Observer>
      <DragUpload onFileLoaded={onFileLoaded}></DragUpload>
      <Button onClick={() => console.log('plus', store.plus(), store.storeSnapshot())}>plus</Button>
      <Button onClick={() => console.log('snap', store.snap())}>getSnapshot</Button>
      <Button onClick={() => console.log('snap', store.clearSnapshot())}>clear</Button>
      <Button onClick={() => console.log('snap', store.clearSnapshot(true), store)}>force clear</Button>
    </div>
  );
};

export default ExaManager;