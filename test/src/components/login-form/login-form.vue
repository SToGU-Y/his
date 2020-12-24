<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="login">
    <FormItem prop="sid">
      <Input v-model="form.sid" placeholder="请输入用户名">
      <span slot="prepend">
        <Icon :size="16" type="ios-person"></Icon>
      </span>
      </Input>
    </FormItem>
    <FormItem prop="spw">
      <Input type="password" v-model="form.spw" placeholder="请输入密码">
      <span slot="prepend">
        <Icon :size="14" type="md-lock"></Icon>
      </span>
      </Input>
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
      sidRules: {
        type: Array,
        default: () => {
          return [{
            required: true,
            message: '账号不能为空',
            trigger: 'blur'
          }]
        }
      },
      spwRules: {
        type: Array,
        default: () => {
          return [{
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }]
        }
      }
    },
    data() {
      return {
        form: {
          sid: '',
          spw: ''
        }
      }
    },
    computed: {
      rules() {
        return {
          sid: this.sidRules,
          spw: this.spwRules
        }
      }
    },
    methods: {
      login() {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.$emit('on-success-valid', {
              sid: this.form.sid,
              spw: this.form.spw
            })
          }
        })
      }
    }
  }

</script>
