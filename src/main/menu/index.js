const { app, Menu, BrowserWindow } = require('electron')
import {
  changeFullScreen,
  changeMenuShow,
  captureImage
} from '../event/clickEvent.js'

const template = [
  {
    label: '文件',
    submenu: [
      {
        label: '打开文件',
        click() {
          console.log('打开文件')
        }
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
    label: '快捷键',
    submenu: [
      {
        label: '截图',
        accelerator: 'shift+a',
        click() {
          captureImage()
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
        label: '菜单显示/隐藏',
        accelerator: 'alt+s',
        click() {
          let mainWindow = BrowserWindow.getFocusedWindow()
          changeMenuShow(mainWindow)
        }
      }
    ]
  },
  {
    label: '角色',
    submenu: [
      { label: '复制', role: 'copy' },
      { label: '剪切', role: 'cut' },
      { label: '粘贴', role: 'paste' },
      { label: '最小化', role: 'minimize' }
    ]
  },
  {
    label: '类型',
    submenu: [
      { label: '选项1', type: 'checkbox' },
      { label: '选项2', type: 'checkbox' },
      { label: '选项3', type: 'checkbox' },
      { type: 'separator' },
      { label: 'item1', type: 'radio' },
      { label: 'item2', type: 'radio' },
      { type: 'separator' },
      { label: 'windows', type: 'submenu', role: 'windowMenu' }
    ]
  },
  {
    label: '其它',
    submenu: [
      {
        label: '打开',
        accelerator: 'ctrl + o',
        click() {
          console.log('open操作执行了')
        }
      }
    ]
  }
]

export function CreateMenu() {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
