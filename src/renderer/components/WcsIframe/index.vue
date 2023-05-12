<template>
  <div class="wcs-web">
    <!-- <div class="box">
      <input type="text" @focus="showTouchKeyboard()" />
    </div> -->
    <iframe
      ref="iframe"
      class="wcs-iframe"
      :src="url"
      frameborder="0"
      sandbox="allow-scripts allow-same-origin "
    ></iframe>

    <!-- 拍照界面 -->
    <el-dialog
      custom-class="photo-dialog"
      title="拍照"
      :visible.sync="dialogVideoVisible"
      append-to-body
      :close-on-click-modal="false"
      :before-close="beforeClose"
    >
      <div class="photo-top">
        <video
          ref="photoVideo"
          autoplay
          class="photo-video"
          width="400"
          height="400"
        ></video>
        <div ref="photoView" class="photo-view">
          <el-image
            style="width: 100%; height: 100%"
            fit="contain"
            :src="imgData"
            :preview-src-list="imgDataList"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <!-- <img :src="imgData" alt="无效照片" /> -->
        </div>
        <canvas
          ref="photoCanvas"
          id="canvas"
          width="400"
          height="400"
          style="display: none"
        ></canvas>
      </div>
      <div class="photo-bottom">
        <el-button plain @click="takePhoto">拍照</el-button>
        <el-button type="primary" plain @click="upload">上传</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const { ipcRenderer } = require('electron')
const child_process = require('child_process')

import { CaptureImage } from '../../../main/utils/capture.js'
import { Tabtip } from '../../../main/utils/tabtip.js'
import request from '../../utils/request.js'
import {
  setTaskIdStorage,
  getTaskIdStorage
} from '../../utils/localstorageOperation.js'

let photoVideo
export default {
  data() {
    return {
      url: 'http://127.0.0.1:9033/',
      // url: 'http://192.168.2.55:9033/',

      // 拍照对话框
      dialogVideoVisible: false,
      // 图片
      imgData: null,
      imgDataList: []
    }
  },
  mounted() {
    // if (process.env.NODE_ENV === 'development') {
    //   this.url = 'http://192.168.2.55:9527/'
    // } else {
    //   this.url = 'http://192.168.2.55:9033/'
    // }

    // 接收菜单截图的消息
    ipcRenderer.on('menu-event', (event, arg) => {
      console.log(arg)
      this.dialogVideoVisible = false
      if (arg === 'photo') {
        this.dialogVideoVisible = true
        this.$nextTick(() => {
          this.takeVideo()
        })
      }
      if (arg === 'scan') {
        this.scanPhoto()
      }
    })

    // 接收菜单截图的消息
    ipcRenderer.on('screen-shot', (event, arg) => {
      CaptureImage().then(res => {
        this.$refs.iframe.contentWindow.postMessage(
          {
            type: 'screenShotAccept',
            img: res
          },
          '*'
        )
      })
    })

    // 监听事件
    window.addEventListener('message', e => {
      const data = e.data
      // 截图完成之后通知前端上传
      if (data.type === 'screenShotSend') {
        CaptureImage().then(res => {
          this.$refs.iframe.contentWindow.postMessage(
            {
              type: 'screenShotAccept',
              img: res
            },
            '*'
          )
        })
      }
      // 调用系统触摸键盘
      if (data.type === 'tabtip') {
        console.log('-=-=-=-==-=-=-=-=-888888')
        // Tabtip()
        this.openKeyBord()
        // this.showTouchKeyboard()
      }
      // 下载文件
      if (data.type === 'download') {
        ipcRenderer.send('download', {
          downloadPath: data.url, // 下载链接（以下载vue文件为例）
          fileName: data.name // 下载文件名，需要包含后缀名
        })
      }
      // 本地存储任务信息
      if (data.type === 'taskStorage') {
        setTaskIdStorage(data.data)
      }
    })
  },
  methods: {
    openKeyBord() {
      child_process.exec('osk.exe')
    },
    showTouchKeyboard() {
      // alert('afasfsdf')
      // child_process.exec('node tabtip')
      child_process.exec(
        'start "C:\\Program Files\\Common Files\\microsoft shared\\ink" TabTip.exe',
        (error, stdout, stderr) => {
          if (error) {
            alert(error, stdout, stderr)
            console.log(error, stdout, stderr)
          }
        }
      )

      // child_process.execFile(
      //   'tabtip.bat',
      //   null,
      //   { cwd: 'E:/nginx-1.18.0' },
      //   function (error, stdout, stderr) {
      //     if (error !== null) {
      //       console.log('exec error' + error)
      //     } else console.log('成功')
      //     console.log('stdout: ' + stdout)
      //     console.log('stderr: ' + stderr)
      //   }
      // )
    },

    // 开始视频录制
    takeVideo() {
      photoVideo = this.$refs.photoVideo

      navigator.mediaDevices
        .getUserMedia({
          video: { width: 400, height: 400 },
          audio: false
        })
        .then(stream => {
          photoVideo.srcObject = stream
          photoVideo.play()
        })
        .catch(err => {
          console.log('An error occurred: ' + err)
        })
    },
    // 拍照
    takePhoto() {
      const context = this.$refs.photoCanvas.getContext('2d')
      context.drawImage(photoVideo, 0, 0, 400, 400)

      this.imgData = this.$refs.photoCanvas.toDataURL('image/png')
      this.imgDataList = [this.imgData]
    },
    // 关闭前的提示
    beforeClose(done) {
      this.$confirm('照片还未保存，是否关闭', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.imgData = null
          this.imgDataList = []
          done()
        })
        .catch(err => {
          return
        })
    },
    // 上传拍照
    upload() {
      let pictureName = this.$m().format('YYYY-MM-DD HH:mm:ss')
      request
        .jsonPost('api/save-picture/savePicture', {
          file: this.imgData,
          securityId: getTaskIdStorage().id,
          pictureName: pictureName,
          type: '4'
        })
        .then(res => {
          if (res.data.code == 200) {
            this.$message({
              message: '上传成功',
              type: 'success'
            })

            this.imgData = null
            this.imgDataList = []
            this.dialogVideoVisible = false
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
          console.log(res, 'ressss')
        })
        .catch(err => {
          this.$message({
            message: '上传失败',
            type: 'error'
          })
        })
    },
    // 扫描
    scanPhoto() {
      console.log('扫描数据')
      request
        .post('api/save-picture/scanPicture')
        .then(res => {
          if (res.data.code == 200) {
            this.$message({
              message: '数据扫描中',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          }
        })
        .catch(err => {
          this.$message.error('扫描数据失败')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.wcs-web {
  width: 100vw;
  height: 100vh;

  .wcs-iframe {
    width: 100vw;
    height: 100vh;
  }

  .box {
    position: fixed;
    top: 50px;
    left: 100px;
  }
}
</style>
<style lang="scss">
.photo-dialog {
  width: 70%;
  height: 60%;
  display: flex;
  flex-flow: column nowrap;

  .el-dialog__body {
    flex: 1;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;

    .photo-top {
      flex: 1;
      width: 100%;
      display: flex;

      .photo-video,
      .photo-view {
        width: 50%;
        height: 100%;
      }

      .photo-view {
        display: flex;
        justify-content: center;
        align-items: center;

        .image-slot {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          background: #f5f7fa;
          color: #909399;
          font-size: 30px;
        }
      }
    }

    .photo-bottom {
      margin-top: 16px;
    }
  }
}
</style>
