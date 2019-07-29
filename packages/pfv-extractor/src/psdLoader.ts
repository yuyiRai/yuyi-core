import { Layer, Psd, readPsd } from 'ag-psd';
import 'ag-psd/initialize-canvas'; // only needed for reading image data and thumbnails
import * as fs from 'fs';
import paths from 'path';
import './encoding';
// import { FileUtil } from './main/index';

export default interface ILayerTree {
  [key: string]: Layer
}
export interface ILayer {
  [key: string]: any;
}

const PSD: any = require('psd');
const pathGroup: { [key: string]: any } = {}
// declare const PSD: any;
export class Utils {
  public static findLayer(child: Layer | Psd): ILayerTree | null {
    const { name, canvas, children } = child;
    const layerName = (name || '').toStr();
    if (canvas && name) {
      return { [layerName]: child }
    } else if (children) {
      return {
        [layerName || 'root']: [{}, ...children].reduce((obj, layer) => ({ ...obj, ...this.findLayer(layer) }))
      }
    }
    return null
  }

  public static convertArrayToObjectByKey(list: any[], key: string | ((obj: any) => string), innerValueKey?: string): any {
    return [{}].concat(list).reduce((obj, item) => ({ ...obj, [typeof key == 'string' ? item[key] : key(item)]: innerValueKey ? item[innerValueKey] : item }))
  }

  public static getTree(child: any): ILayer | null {
    const layerName = (child.get('name') || '').toStr();
    child.name = layerName;
    // this.getMask(child)
    if (child.hasChildren()) {
      if (!child.isRoot()) {

        pathGroup[child.path()] = child
      }
      return {
        [layerName || 'root']: [{ [layerName]: child }, ...child.children()].reduce((obj, layer) => ({ ...obj, ...this.getTree(layer) }))
      }
    } else if (layerName) {
      pathGroup[child.path()] = child;
      return { [layerName]: child }
    }
    return null
  }

  public static async load(userFolder: string, fileName: string): Promise<any> {
    // const file: FileUtil = new FileUtil(userFolder + fileName + '.pfv');
    // const pfv: string = await file.readFilesPromise('utf8');
    // // console.log(pfv)
    // const groups: Array<string | object> = pfv.split(/\n\/\/(.*?)\~filter\n/ig);
    // const group: any = groups.reduce((obj: string | any, current: string, index: number, array: Array<string>) => {
    //   if (typeof obj != 'object') {
    //     return { pre: current }
    //   } else if (index % 2 == 1) {
    //     return { ...obj, pre: current }
    //   } else {
    //     return { ...obj, [obj.pre]: toJS(new PfvFilterGroup(current.split(/\n\n/ig).map((text) => text.split('\n')), obj.pre)), pre: undefined }
    //   }
    // })

    // console.log(fs.readFileSync(userFolder+fileName+'.pfv', 'utf8'))
    const buffer = fs.readFileSync(userFolder + fileName + '.psd');
    // read only document structure
    const psd1 = readPsd(buffer);
    // console.log(psd1, psd1.children && psd1.children.length);
    // const tree: ILayerTree | null = Utils.findLayer(psd1)
    // if(tree != null){
    //   for(const item of Object.keys(tree)){
    //     console.log(item, tree[item].canvas)
    //     Utils.output(userFolder, tree[item])
    //   }
    // }
    const psd = PSD.fromFile(userFolder + fileName + '.psd');
    psd.parse();
    const nativeTree = psd.tree()
    const tree: any = Utils.getTree(nativeTree);
    console.log(tree, pathGroup)
    Object.keys(pathGroup).forEach((path: string) => {
      const layer = pathGroup[path]
      Utils.output(userFolder, path, layer)
    });
    return tree
  }
  public static output(userFolder: string, pathFolder: string, layer: Layer | any) {
    const fileName = this.ToDBC((layer.name.replace(/\!/ig, "force-").replace(/\*/ig, "select-").replace(":", "-") || 'undefined'))
    const outPath = paths.join(userFolder, "resource", pathFolder.replace(layer.name, "").replace(/\!/ig, "force-").replace(/\*/ig, "select-"));
    const { ensureDirSync } = require('fs-extra')
    if (!fs.existsSync(outPath)) {
      ensureDirSync(outPath)
    }
    fs.writeFileSync(paths.join(outPath, fileName + '.txt'), fileName);
    // if (layer.canvas) {
    //   return fs.writeFileSync(paths.join(outPath, fileName + '.png'), layer.canvas.toBuffer('image/png'));
    // } else if (layer.name.indexOf('.mask') == -1) {
    //   const image = layer.get('image');
    //   if (image.hasMask) {
    //     image.saveMaskAsPng(paths.join(outPath, fileName + '.mask.png'))
    //   }
    //   if (!image.layer.isFolder() && !layer.isEmpty()) {
    //     image.saveAsPng(paths.join(outPath, fileName + '.png'))
    //   }
    // } else if (layer.file) {
    //   fs.writeFileSync(paths.join(outPath, fileName), layer.file.data)
    // }
  }
  public static ToDBC(txtstring: string) {
    let tmp = "";
    for (let i = 0; i < txtstring.length; i++) {
      if (/[\@\#\$\%\^\&\*\(\)\{\}\:\"\L\<\>\?\[\]]/.test(txtstring.charAt(i))) {
        if (txtstring.charCodeAt(i) == 32) {
          tmp += String.fromCharCode(12288);
        } else if (txtstring.charCodeAt(i) < 127) {
          tmp += String.fromCharCode(txtstring.charCodeAt(i) + 65248);
        } else {
          tmp += txtstring.charAt(i)
        }
      } else {
        tmp += txtstring.charAt(i)
      }
    }
    return tmp;
  }
  public async run() {
    // const tree1= Utils.load('E:\\素材\\立ち絵\\立ち絵きりたん修正奴\\', '立ち絵きりたん')
    // console.log(tree1)

    // const tree2 = await Utils.load('E:\\素材\\立ち絵\\立ち絵きりたん修正奴\\', 'aoi')
    // console.log(tree2)
    const tree3 = Utils.load('E:\\素材\\立ち絵\\MtU_aoi\\MtU_aoi\\MtU_aoi\\', 'MtU_aoi')
    console.log(tree3)
    // const tree4 = await Utils.load('E:\\素材\\立ち絵\\MtU_akane\\MtU_akane\\MtU_akane\\', 'MtU_akane')
    // console.log(tree4)
    // const tree4 = await Utils.load('E:\\素材\\立ち絵\\m_itako\\', 'm_itako')
    // console.log(tree4)
    // read document structure and image data
    // const psd2 = readPsd(buffer);
    // console.log(psd2);
    // fs.writeFileSync('layer-1.png', psd2.children[0].canvas.getBuffer());
  }
}

new Utils().run()