export enum ChcpCode {
  utf8,
  shiftjis,
  gbk
}

export const codeoptions = [65001, 932, 936];
export const chcpCodeValues = {
  65001: ChcpCode.utf8,
  932: ChcpCode.shiftjis,
  936: ChcpCode.gbk
};

export type EncodingNames = keyof ({
  [K in keyof (typeof ChcpCode)]: (typeof ChcpCode)[K]
})
