export const Tabtip = () => {
  const { execFile } = require('child_process')
  if (process.env.NODE_ENV !== 'development') {
    execFile(require('path').join(__static, '../../../../../tabtip/TabTip.exe'))
  } else {
    execFile(
      require('path').join(__static, '/tabtip/TabTip.exe'),
      null,
      (err, stdout, stderr) => {
        if (err) {
          console.error(err)
        }
        console.log(stdout)
        console.log(stderr)
      }
    )
  }
}
