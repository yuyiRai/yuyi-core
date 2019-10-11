import flatten from 'core-js/fn/array/flatten'
if (!window.Element.prototype.dataset) {
  Object.defineProperty(window.Element.prototype, 'dataset', {
    get() {
      const ele = this
      var attrs = ele.attributes // 元素的属性集合
      var dataset = {}
      var name
      var matchStr
      for (var i = 0; i < attrs.length; i++) {
        // 是否是data- 开头
        matchStr = attrs[i].name.match(/^data-(.+)/)
        if (matchStr) {
          // data-auto-play 转成驼峰写法 autoPlay
          name = matchStr[1].replace(/-([\da-z])/gi, function(all, letter) {
            return letter.toUpperCase()
          })
          dataset[name] = attrs[i].value
        }
      }
      return dataset
    }
  })
}

if (!window.HTMLDivElement.prototype.remove && window.HTMLDivElement.prototype.removeNode) {
  Object.defineProperty(window.HTMLDivElement.prototype, 'remove', {
    get() {
      return this.removeNode
    }
  })
}

if (!Array.prototype.flat) {
  // eslint-disable-next-line
  Array.prototype.flat = Array.prototype.flatten
}
