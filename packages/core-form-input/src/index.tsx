import './types/env';
import Button from '@material-ui/core/Button';
import * as React from 'react';
import { useState } from 'react';
import VirtualizedList from './components/List';
import SearchInput, { ISearchInputProps } from './components/SearchInput';
import VTree from './components/VTree';

export * from './utils';
export { Button, VTree, SearchInput, VirtualizedList };
// Delete me
export function test(a: any, b: any) {
  return filters<number>(b, a, a || b)
}
export const a = tsKeys<ISearchInputProps>()
export const Thing = () => {
  const [t, st] = useState<any>()
  const [useLazy, reset] = useState<any>(true)
  console.log(Button)
  return (
    <div>
      the snozzberries taste like snozzberrie
      <VirtualizedList></VirtualizedList>
      <SearchInput value={t} onChange={st} useLazyHandler={useLazy} />
      <Button onClick={() => reset((v: any) => !v)}>{(useLazy ? '懒' : '完全') + '监听'}</Button>
      <VTree />
    </div>
  );
};
