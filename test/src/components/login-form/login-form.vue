<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="login">
    <FormItem prop="username">
      <Input v-model="form.username" placeholder="请输入用户名">
      <span slot="prepend">
        <Icon :size="16" type="ios-person"></Icon>
      </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
      <span slot="prepend">
        <Icon :size="14" type="md-lock"></Icon>
      </span>
      </Input>
    </FormItem>
    <FormItem prop="code">
      <Input type="text" v-model="form.code" placeholder="请输入验证码" style="width: 150px" />
      <img :src="vcUrl" @click="updateVerifyCode" style="cursor: pointer">
    </FormItem>
    <FormItem>
      <Button @click="login" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
  export default {
    name: 'LoginForm',
    props: {
      usernameRules: {
        type: Array,
        default: () => {
          return [{
            required: true,
            message: '账号不能为空',
            trigger: 'blur'
          }]
        }
      },
      passwordRules: {
        type: Array,
        default: () => {
          return [{
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }]
        }
      },
      codeRules: {
        type: Array,
        default: () => {
          return [{
            required: true,
            message: '验证码不能为空',
            trigger: 'blur'
          }]
        }
      }
    },
    data() {
      return {
        vcUrl: 'http://localhost:8081/verifyCode?time=' + new Date(),
        form: {
          username: '',
          password: '',
          code : ''
        }
      }
    },
    computed: {
      rules() {
        return {
          username: this.usernameRules,
          password: this.passwordRules,
          code: this.codeRules
        }
      }
    },
    methods: {
      login() {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.$emit('on-success-valid', {
              username: this.form.username,
              password: this.form.password,
              code: this.form.code
            })
          }
        })
      },
      updateVerifyCode() {
        this.vcUrl = 'http://localhost:8081/verifyCode?time=' + new Date();
      }
    }
  }

</script>
