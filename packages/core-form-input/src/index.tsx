import Button from '@material-ui/core/Button';
import * as React from 'react';
import { useState } from 'react';
import VirtualizedList from './components/List';
import SearchInput from './components/SearchInput';
import VTree from './components/VTree';
import './types';

export * from './utils';
export { Button, VTree, SearchInput, VirtualizedList };
// Delete me
export const Thing = () => {
  const [t, st] = useState()
  const [useLazy, reset] = useState(true)
  console.log(Button)
  return (
    <div>
      the snozzberries taste like snozzberrie
      <VirtualizedList></VirtualizedList>
      <SearchInput value={t} onChange={st} useLazyHandler={useLazy} />
      <Button onClick={() => reset(v => !v)}>{(useLazy ? '懒' : '完全') + '监听'}</Button>
      <VTree />
    </div>
  );
};

