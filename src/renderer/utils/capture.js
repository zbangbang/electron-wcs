import { clipboard } from 'electron'

export const CaptureImage = () => {
  return new Promise(resolve => {
    const { execFile } = require('child_process')
    console.log(__static)
    let screen_win = execFile(__static + '/capture/PrintScr.exe')

    screen_win.on('exit', function (code) {
      if (code) {
        let png = clipboard.readImage().toPNG()
        let imagebase64 = png.toString('base64')
        const imageprefix = 'data:image/png;base64,'
        let imgs = imageprefix + imagebase64
        resolve(imgs)
      }
    })
  })
}
