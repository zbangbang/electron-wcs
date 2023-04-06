<template>
  <div id="wcs-app">
    <wcs-iframe></wcs-iframe>
  </div>
</template>

<script>
import WcsIframe from '@/components/WcsIframe/index.vue'
export default {
  name: 'electron-wcs',
  components: {
    WcsIframe
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
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
