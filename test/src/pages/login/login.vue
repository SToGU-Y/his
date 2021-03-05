<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="login"></login-form>
          <p class="login-tip"><a href="/patient/query">病患自助查询</a></p>
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
      login({username,password,code}){
        this.$http({
            url: '/login',
            method: 'POST',
            data: {
              "username": username,
              "password": password,
              "code" : code
            }
          })
          .then(res => {
            if (res.data.status == 200) {
              localStorage.setItem("TOKEN",JSON.stringify(res.data.data))
              this.$router.push({ 
                path: '/admin'
              });
            } else if (res.data.status == 500) {
              alert(res.data.msg)
            }
          })
          .catch(err => {
            alert("服务器出错")
            console.log(err)
          })
      }
    }
  }

</script>

<style scope>
  @import './login.css';

</style>
