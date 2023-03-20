import { globalShortcut } from 'electron'
import { changeFullScreen, changeMenuShow, captureImage } from './clickEvent.js'

export function RegisterEvent(mainWindow) {
  // 全屏切换
  globalShortcut.register('Alt+F', () => {
    changeFullScreen(mainWindow)
  })

  // 菜单显示
  globalShortcut.register('Alt+S', () => {
    changeMenuShow(mainWindow)
  })

  // 截图
  globalShortcut.register('Shift+A', () => {
    captureImage()
  })
}
