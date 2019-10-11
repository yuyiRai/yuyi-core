import client from 'webpack-theme-color-replacer/client'
import themeColor from '@/config/theme.config'
import { map } from 'lodash'
import changeColor from '@/components/SettingDrawer/changeColor'

export default {
  config: themeColor,
  configList: map(themeColor, (c, key) => ({ key, ...c })),
  changeColor(theme, colors) {
    const newColors = changeColor(theme, ...(colors instanceof Array ? colors : []))
    var options = {
      newColors, // new colors array, one-to-one corresponde with `matchColors`
      changeUrl(cssUrl) {
        return `/${cssUrl}` // while router is not `hash` mode, it needs absolute path
      }
    }
    return client.changer.changeColor(options, Promise)
  }
}
