<template>
  <div id="app">
    <div class="btnBox">
      <button @click="send()">点击</button>
      <img :src="testImg" alt="" />
    </div>
    <!-- <router-view></router-view> -->
    <wcs-iframe></wcs-iframe>
  </div>
</template>

<script>
import WcsIframe from '@/components/WcsIframe/index.vue'
import { CaptureImage } from './utils/capture.js'
const electron = require('electron')
const ipc = electron.ipcRenderer
ipc.on('capture', (e, data) => {
  console.log(e, data)
})
export default {
  name: 'electron-wcs',
  components: {
    WcsIframe
  },
  data() {
    return {
      testImg: null
    }
  },
  methods: {
    send() {
      CaptureImage().then(res => {
        this.testImg = res
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.btnBox {
  position: fixed;
  top: 0;
  left: 0;

  img {
    width: 300px;
    height: 300px;
  }
}
/* CSS */
</style>
