<template>
  <div class="wcs-web">
    <iframe
      ref="iframe"
      class="wcs-iframe"
      :src="url"
      frameborder="0"
      sandbox="allow-scripts allow-same-origin "
    ></iframe>
  </div>
</template>

<script>
import { CaptureImage } from '../../../main/capture.js'
export default {
  data() {
    return {
      url: 'http://192.168.2.55:9033/'
    }
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') {
      this.url = 'http://192.168.2.55:9527/'
    } else {
      this.url = 'http://192.168.2.55:9033/'
    }

    // 监听截图事件，截图完成之后通知前端上传
    window.addEventListener('message', e => {
      const data = e.data
      if (data.type === 'screenShot') {
        CaptureImage().then(res => {
          this.$refs.iframe.contentWindow.postMessage(
            {
              type: 'screenShot',
              img: res
            },
            '*'
          )
        })
      }
    })
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
}
</style>
