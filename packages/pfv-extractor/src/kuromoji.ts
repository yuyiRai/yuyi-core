
import { getTokenizer, KuromojiToken } from "kuromojin";
import path from 'path'

export const Tokenizer = getTokenizer({ dicPath: path.join(__dirname, "..", 'assets/kuromoji/dict') });

export function convertKuromojiTokenToString(token: KuromojiToken[]) {
  return token.map(v => v.reading || v.surface_form).join("");
}
