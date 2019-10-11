export function MultipleSplit(txt: string, str: string, index = 0) {
  const r = []
  const f = str[index]
  if (index < str.length) {
    const list = txt.split(f)
    for (let k = 0; k < list.length; k++) {
      let i = list[k]
      if (k < list.length - 1) {
        i = i + f
      }
      const inner = MultipleSplit(i, str, index + 1)
      for (let k = 0; k < inner.length; k++) {
        let strr = inner[k]
        if (strr.length > 1) {
          r.push(strr)
        }
      }
    }
  } else {
    r.push(txt)
  }
  return r
}
