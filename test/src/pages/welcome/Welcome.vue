<template>
  <div id="welcome">
    <div id="word"><Strong>欢迎</Strong>您使用HIS系统</div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    methods: {}
  }

</script>
<style scoped>
  #welcome{
    background-image: url('../../assets/images/bg.jpg');
    width:100%;
    height:100%;
    position: relative;
    background-repeat: no-repeat;
    background-size: cover;
    -webkit-background-size: cover;
    -o-background-size: cover;
    background-position: center 0;
  }

  #word{
    position: absolute;
    left: 150px;
    top: 150px;
    font-size: 28px;
    background: linear-gradient(to bottom,#a6f0c6 0%,#bbdfc8 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }


  #word Strong{
    font-size: 48px;
  }

</style>
