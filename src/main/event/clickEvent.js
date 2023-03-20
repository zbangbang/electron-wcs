import { CaptureImage } from '../capture.js'
// 切换全屏状态
export function changeFullScreen(mainWindow) {
  if (mainWindow.isFullScreen()) {
    mainWindow.setFullScreen(false)
  } else {
    mainWindow.setFullScreen(true)
  }
}
// 菜单切换显示
export function changeMenuShow(mainWindow) {
  if (mainWindow.isMenuBarVisible()) {
    mainWindow.setMenuBarVisibility(false)
  } else {
    mainWindow.setMenuBarVisibility(true)
  }
}
// 截图功能
export function captureImage() {
  CaptureImage().then(res => {
    console.log(res)
    // axios
    //   .post('http://192.168.2.102:8093/csmm/role/getLoginRoleList')
    //   .then(res => {
    //     console.log(res)
    //   })
  })
}
