import Encoding from 'encoding-japanese';

export type EncodingType = 'UTF16'
  | 'UTF16BE'
  | 'UTF16LE'
  | 'JIS'
  | "AUTO"
  | 'BINARY'
  | 'UTF8'
  | 'ASCII'
  | 'BIG5'
  | 'EUCJP'
  | "GB2312"
  | 'SJIS'
  | 'UNICODE'
  ;

export function toStr(source: string, to?: EncodingType, from?: EncodingType) {
  return Encoding.convert(source, {
    to: to || 'UNICODE',
    from: from || "AUTO",
    type: 'string'
  }) as string
}
export function toBuffer(source: string, to?: EncodingType, from?: EncodingType) {
  return `\\` + Encoding.convert(source, {
    to: to || 'UNICODE',
    from: from || "AUTO",
    type: "array"
  }).join("\\") as string;
}
export const detect = Encoding.detect as {
  (content: string, encode: EncodingType): string
};
export const urlEncode = Encoding.urlEncode as {
  (content: string): string;
};
