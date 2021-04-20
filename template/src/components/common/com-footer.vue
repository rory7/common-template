<template>
  <div class="footer">
    <p>
      <a href="http://www.9law.com" target="_blank">技术支持单位:北京华宇九品科技有限公司</a>
    </p>
  </div>
</template>

<script>
  export default {
    props: {
      contactMobile: {
        type: String,
        default: "",
      },
      technicalContact: {
        type: String,
        default: '',
      }
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
</style>
