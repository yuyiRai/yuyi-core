var client = require('webpack-theme-color-replacer/client')
var generate = require('@ant-design/colors/lib/generate').default;
var themeColor = require('../../config/theme.config')
var themeColorKey = Object.keys(themeColor);

/**
 *
 * @param {keyof themeColor} theme
 * @param  {...any} colors
 */
function changeColor(theme, ...colors) {
  if (!theme || !themeColorKey.includes(theme)) {
    theme = 'cool';
  }
  var themeConfig = themeColor[theme];
  for (const i in themeConfig.primaryColorList) {
    if (!colors[i]) {
      colors[i] = themeConfig.primaryColorList[i]
    }
  }
  console.log('newColors', colors)
  return colors.reduce((l, c) => l.concat(getAntdSerials(c)), []).concat(themeConfig.color);
}
var getAntdSerials = (color) => {
  // 淡化（即less的tint）
  var lightens = new Array(9).fill().map((t, i) => {
    return client.varyColor.lighten(color, i / 10);
  });
  var colorPalettes = generate(color);
  var fadeColorPalettes = [client.varyColor.lighten(color, 0.97)];
  return lightens.concat(colorPalettes).concat(fadeColorPalettes);
}
export default changeColor
