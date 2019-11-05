import * as React from 'react';
import VirtualizedList from './components/List';
import SearchInput from './components/SearchInput'
import { useState } from 'react';
import Button from '@material-ui/core/Button';
import VTree from './components/VTree';

export { Button, VTree, SearchInput, VirtualizedList }
// Delete me
export const Thing = () => {
  const [t, st] = useState()
  const [useLazy, reset] = useState(true)
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
