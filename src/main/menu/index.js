const { app, Menu, BrowserWindow } = require('electron')
const PDFWindow = require('electron-pdf-window')
import {
  changeFullScreen,
  changeMenuShow,
  captureImage
} from '../event/clickEvent.js'

let helpPdfWin = null
let usePdfWin = null
const template = [
  {
    label: '菜单',
    submenu: [
      {
        label: '重新加载',
        role: 'reload'
      },
      {
        label: '帮助手册',
        click() {
          if (helpPdfWin) {
            helpPdfWin.close()
          }
          let mainWindow = BrowserWindow.getFocusedWindow()
          let width = mainWindow.getSize()[0] * 0.8
          width = width >= 800 ? (width <= 900 ? width : 900) : 800
          let height = mainWindow.getSize()[1] * 0.8
          height = height >= 600 ? height : 600
          helpPdfWin = new PDFWindow({
            width,
            height
          })
          helpPdfWin.on('close', e => {
            helpPdfWin = null
          })
          helpPdfWin.setMenuBarVisibility(false)
          // helpPdfWin.setSkipTaskbar(true)

          // win.loadURL(require('path').join(__static, '/pdf/123.pdf'))
          helpPdfWin.loadURL(
            require('path').join(__static, '/pdf/帮助手册.pdf')
          )
        }
      },
      {
        label: '使用手册',
        click() {
          if (usePdfWin) {
            usePdfWin.close()
          }
          let mainWindow = BrowserWindow.getFocusedWindow()
          let width = mainWindow.getSize()[0] * 0.8
          width = width >= 800 ? (width <= 900 ? width : 900) : 800
          let height = mainWindow.getSize()[1] * 0.8
          height = height >= 600 ? height : 600
          usePdfWin = new PDFWindow({
            width,
            height
          })
          usePdfWin.on('close', e => {
            usePdfWin = null
          })
          usePdfWin.setMenuBarVisibility(false)
          // usePdfWin.setSkipTaskbar(true)

          // win.loadURL(require('path').join(__static, '/pdf/123.pdf'))
          usePdfWin.loadURL(
            require('path').join(__static, '/pdf/使用说明书.pdf')
          )
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
    label: '功能键',
    submenu: [
      {
        label: '拍照',
        click() {
          let mainWindow = BrowserWindow.getFocusedWindow()
          mainWindow.webContents.send('menu-event', 'photo')
        }
      },
      {
        label: '扫描',
        click() {
          let mainWindow = BrowserWindow.getFocusedWindow()
          mainWindow.webContents.send('menu-event', 'scan')
        }
      },
      {
        label: '截图',
        // accelerator: 'shift+a',
        click() {
          let mainWindow = BrowserWindow.getFocusedWindow()
          mainWindow.webContents.send('screen-shot', 1)
        }
      },
      {
        type: 'separator'
      },
      {
        label: '全屏',
        // accelerator: 'alt+f',
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
