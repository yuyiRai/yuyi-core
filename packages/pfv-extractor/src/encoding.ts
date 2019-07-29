import 'encoding-japanese'
const Encoding = require('encoding-japanese');

declare global {
  export interface String {
    toStr(to?: encoding): string;
  }
}

type encoding = 'UTF16'
  | 'UTF16BE'
  | 'UTF16LE'
  | 'JIS'
  | 'UTF8'
  | 'EUCJP'
  | 'SJIS'
  | 'UNICODE'
  ;

String.prototype.toStr = function (to?: encoding) {
  return Encoding.convert(this, {
    to: to || 'UNICODE',
    from: 'AUTO',
    type: 'string'
  }) as string
}