// import { getTokenizer } from "kuromojin"
// import isEqual from 'lodash/isEqual'
const shell = require('shelljs')
// const ignore = {
//   "*": true
// }
// getTokenizer().then(r => {
//   const b = r.tokenizeForSentence("東北きりたん立ち絵Ver1β").map(v => v.reading && ignore[v.reading] !== '*'  && v.reading || v.basic_form).join("")
//   const a = r.tokenize("東北きりたん立ち絵Ver1β").map(v => v.reading && ignore[v.reading] !== '*' && v.reading || v.basic_form).join("")
//   console.log(a, b, isEqual(a, b))
// })

console.log(shell.exec("AVIUTL_DIR").stdout)
