import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron'
import '../renderer/store'
import axios from 'axios'
const path = require('path')
import { CreateMenu } from './menu/index.js'
import { RegisterEvent } from './event/register.js'
import { initDownload } from './utils/download.js'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
// const winURL = 'http://192.168.2.55:9033/'
const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    show: false,
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true, //在网页中集成Node
      enableRemoteModule: true // 打开remote模块
    },
    fullscreen: true,
    icon: path.join(__dirname, '/static/images/weather.ico')
  })

  CreateMenu()
  // mainWindow.menuBarVisible = false
  mainWindow.loadURL(winURL)
  mainWindow.setAspectRatio(16 / 9)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  RegisterEvent(mainWindow)
  initDownload(mainWindow)
}

app.on('ready', () => {
  createWindow()
  // CreateMenu()
  // mainWindow.menuBarVisible = true
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
