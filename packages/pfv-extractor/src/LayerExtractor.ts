import { Layer, Psd, readPsd } from 'ag-psd';
import 'ag-psd/initialize-canvas'; // only needed for reading image data and thumbnails
import * as fs from 'fs';

export class LayerExtractor {
  public psd: Psd
  constructor(public userFolder: string, public fileName: string) {

    const buffer = fs.readFileSync(userFolder + fileName + '.psd');
    // read only document structure
    this.psd = readPsd(buffer);

    const t = this.extractor()

  }

  public extractor(root: Layer = this.psd) {
    const res = {
      children: null,
      name: null,
      layer: null
    }
    if (root.children) {
      res.children = root.children.map(layer => {
        return this.extractor(layer)
      })
    }
    res.name = root.name
    res.layer = root
    return res
  }
}

new LayerExtractor('E:\\素材\\立ち絵\\MtU_aoi\\MtU_aoi\\MtU_aoi\\', 'MtU_aoi')