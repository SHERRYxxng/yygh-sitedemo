<template>
  <!-- header -->
  <div>
  </div>
  <!-- footer -->
</template>
<script>
export default {
  layout: "empty",
  data() {
    return {
    }
  },
  mounted() {
    // url?token=1&name=1&openid=1   this.$route.query.token
     //url/name/111/xxxx    this.$route.params.id
    let token = this.$route.query.token
    let name = this.$route.query.name
    let openid = this.$route.query.openid
    // 调用父vue方法

    //调用弹窗的父vue（myheader.vue）的loginCallback方法
    window.parent['loginCallback'](name, token, openid)
  }
}
</script>