<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="login"></login-form>
          <p class="login-tip">输入任意用户名和密码即可</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  import LoginForm from '@/components/login-form'

  export default {
    components: {
      LoginForm
    },
    methods: {
      login({
        sid,
        spw
      }) {
        this.$http({
            url: 'http://localhost:8081/login',
            method: 'post',
            data: {
              "sid": sid,
              "spw": spw
            }
          })
          .then(res => {
            if (res.status == 200) {
              this.$router.push({
                path: '/admin',
                query: {
                  sid: sid
                }
              });
            } else if (res.status == 500) {
              alert("用户不存在！")
            }
          }).catch(err => {
            console.log(err)
          })
      }
    }
  }

</script>

<style scope>
  @import './login.css';

</style>
