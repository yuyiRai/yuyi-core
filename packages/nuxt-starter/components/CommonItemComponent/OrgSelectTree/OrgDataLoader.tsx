import { queryOneCom, querySubCom } from '@/api/company';
import { memoize } from 'lodash';
import { OrgInfo, IOrgDataLoader } from './interface';

export class OrgDataLoader implements IOrgDataLoader {
  getInfo = memoize((comCode: string): Promise<OrgInfo> => {
    return queryOneCom(comCode).then(r => r.data);
  });
  appendChildren = memoize((comCode: string, orglevel: string): Promise<OrgInfo[]> => {
    return querySubCom(comCode, orglevel).then(({ data }) => (!Array.isArray(data) || data.length === 0) ? [] : data);
  }, (...args) => args.join('|'));
}

export default new OrgDataLoader()
