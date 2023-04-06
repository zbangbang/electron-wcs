const { app, Menu, BrowserWindow } = require('electron')
import {
  changeFullScreen,
  changeMenuShow,
  captureImage
} from '../event/clickEvent.js'

const template = [
  {
    label: '菜单',
    submenu: [
      // {
      //   label: '打开文件',
      //   click() {
      //     console.log('打开文件')
      //   }
      // },
      {
        label: '显示/隐藏',
        accelerator: 'alt+s',
        click() {
          let mainWindow = BrowserWindow.getFocusedWindow()
          changeMenuShow(mainWindow)
        }
      },
      {
        label: '重新加载',
        role: 'reload'
      },
      {
        type: 'separator'
      },
      {
        label: '退出',
        role: 'quit'
      },
      {
        label: '关于',
        role: 'about'
      }
    ]
  },
  {
    label: '功能键',
    submenu: [
      {
        label: '截图',
        accelerator: 'shift+a',
        click() {
          let mainWindow = BrowserWindow.getFocusedWindow()
          mainWindow.webContents.send('screen-shot', 1)
        }
      },
      {
        label: '全屏',
        accelerator: 'alt+f',
        click() {
          let mainWindow = BrowserWindow.getFocusedWindow()
          changeFullScreen(mainWindow)
        }
      },
      {
        label: '最小化',
        role: 'minimize'
      }
    ]
  }
]

export function CreateMenu() {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
