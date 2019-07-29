import fs from 'fs-extra';
import { chunk, reduce } from 'lodash';
import { PfvFilterGroup } from './PfvFilterGroup';

export async function load(userFolder: string, fileName: string): Promise<any> {
  const path = userFolder + fileName + '.pfv'
  const pfv: string = await fs.readFileSync(path, 'utf8').toString();
  const groups: Array<string | object> = pfv.split(/\n\/\/(.*?)\~filter\n/ig);
  const [top, ...other] = groups
  const group: PfvFilterGroup[] = reduce(
    chunk(other, 2),
    (obj: PfvFilterGroup[], [key, current]: [string, string]) => {
      const group = new PfvFilterGroup(current.split(/\n\n/ig).map((text) => text.split('\n')), key)
      return obj.concat([group])
    },
    [])
  console.log(pfv)
  const genr = group.map((item, index) => `
    --${item.name}
    local param_${index} = ${JSON.stringify(
    item.childrenList.map(
      r => r.replace('//', 'S.お気に入り/').replace(item.name + '/', item.name + '~')
    )
  ).replace("\[", "{ ").replace("\]", " }")}
  `).join('\r\n')
  return genr
}

load('E:\\素材\\立ち絵\\MTU琴葉茜ver2\\MtU_akane_ver2水德pfv\\', 'MtU_akane_ver2')
