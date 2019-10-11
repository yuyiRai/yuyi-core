import { message } from 'ant-design-vue/es'
import themeColor from './settingColor'
import { castArray } from 'lodash'
// import defaultSettings from '../defaultSettings';

export const configList = themeColor.configList

const colorList = [
  // ...themeColor.config.cool.map((color, index) => ({ key: '冷色' + (index + 1), color })),
  // ...themeColor.config.warm.map((color, index) => ({ key: '暖色' + (index + 1), color }))
  {
    key: '薄暮', color: '#F5222D'
  },
  {
    key: '火山', color: '#FA541C'
  },
  {
    key: '日暮', color: '#FAAD14'
  },
  {
    key: '明青', color: '#13C2C2'
  },
  {
    key: '极光绿', color: '#52C41A'
  },
  {
    key: '拂晓蓝（默认）', color: '#1890FF'
  },
  {
    key: '极客蓝', color: '#2F54EB'
  },
  {
    key: '酱紫', color: '#722ED1'
  }
]

const colorMap = {
  dark: '#1890FF',
  light: '#1890FF',
  cicc: '#1890FF',
  warm: themeColor.config.warm[0],
  cool: themeColor.config.cool[0]
}

let last;
const updateTheme = (newPrimaryColor, theme, changeTheme) => {
  const hideMessage = message.loading(`正在${last && last !== theme ? '切换' : '载入'}主题！`, 0)
  last = theme
  themeColor.changeColor(theme, newPrimaryColor).finally(t => {
    setTimeout(() => {
      changeTheme(theme)
      hideMessage()
    }, 100)
  })
}

const updateColorWeak = colorWeak => {
  colorWeak ? document.body.classList.add('colorWeak') : document.body.classList.remove('colorWeak')
}

export { updateTheme, colorList, colorMap, updateColorWeak }
