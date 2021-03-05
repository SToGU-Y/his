<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #layout {
    width: 100%;
    height: 100%;
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;  
  }

  .layout-logo {
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
    color: white;
    line-height: 30px;
  }

  .layout-nav {
    width: 110px;
    margin: 0 auto;
    margin-right: 20px;
    color: white;
  }

  .layout-nav>.ivu-menu-item {
    float: right;
  }

  .ivu-layout {
    height: 100%;
  }

  /* 设置滚动条样式*/
  .ivu-layout-sider {
    overflow-y: scroll;
  }

  ::-webkit-scrollbar {
    display: none;
    width: 6px;
    background-color: #d8d8d8;
  }

  ::-webkit-scrollbar-track {
    border-radius: 10px;
  }

  ::-webkit-slider-thumb {
    background-color: #bfc1c4;
  }

</style>
<template>
  <div id="layout">
    <Layout>
      <!-- 头部区域 -->
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo">
            HIS
          </div>
          <div class="layout-nav">
            <Dropdown>
              <Avatar style="background-color: #87d068" icon="ios-person"></Avatar>
              <DropdownMenu slot="list">
                <DropdownItem @click.native="getStaffByUsername()">用户信息</DropdownItem>
                <DropdownItem @click.native="passwordPannel()">修改密码</DropdownItem>
                <DropdownItem @click.native="logout()">注销</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Modal :mask-closable="false" :closable="false" v-model="modal2" title="个人信息">
              <Form ref="staff" label-colon=":" label-position="right" :label-width="100"
                :model="staffForm">
                <FormItem label="工号" prop="username">
                  <!-- <Input disabled  v-model="staffForm.username" /> -->
                  {{staffForm.username}}
                </FormItem>
                <FormItem label="姓名" prop="staffName">
                  <!-- <Input disabled v-model="staffForm.staffName" /> -->
                  {{staffForm.staffName}}
                </FormItem>
                <FormItem label="所属科室" prop="deptName">
                  <!-- <Input disabled v-model="staffForm.deptName"/> -->
                  {{staffForm.deptName}}
                </FormItem>
                <FormItem label="性别" prop="staffSex">
                  <!-- <Input disabled v-model="staffForm.staffSex" /> -->
                  {{staffForm.staffSex}}
                </FormItem>
                <FormItem label="身份证号" prop="idNumber">
                  <!-- <Input disabled v-model="staffForm.idNumber" /> -->
                  {{staffForm.idNumber}}
                </FormItem>
                <FormItem label="联系电话" prop="staffTel">
                  <!-- <Input disabled v-model="staffForm.staffTel" /> -->
                  {{staffForm.staffTel}}
                </FormItem>
                <FormItem label="入职时间" prop="entryTime">
                  <!-- <Input disabled v-model="staffForm.entryTime" /> -->
                  {{staffForm.entryTime}}
                </FormItem>
              </Form>
              <div slot="footer">
                <Button @click.native="close()">关闭</Button>
              </div>
            </Modal>

            <Modal :mask-closable="false" :closable="false" v-model="modal" title="更改密码">
              <Form ref="passwordForm" label-colon=":" label-position="right" :label-width="100"
                :model="passwordForm" :rules="ruleValidate">
                <FormItem label="旧密码" prop="oldpw">
                  <Input type="password" v-model="passwordForm.oldpw"/>
                </FormItem>
                <FormItem label="新密码" prop="newpw">
                  <Input type="password" v-model="passwordForm.newpw"/>
                </FormItem>
                <FormItem label="确认密码" prop="newpws">
                  <Input type="password" v-model="passwordForm.newpws"/>
                </FormItem>
              </Form>
              <div slot="footer">
                <Button @click.native="yes">修改</Button>
                <Button @click.native="no">取消</Button>
              </div>
            </Modal>
          </div>
        </Menu>
      </Header>
      <!-- 侧边栏区域 -->
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu width="auto">
            <Submenu v-for="(menu,index) in menus" :name="menu.name+'_'+index" :key="menu.name+'_'+index">
              <template slot="title">
                <Icon :type="menu.iconCls" />
                {{menu.name}}
              </template>
              <MenuItem v-for="(children,index) in menu.children" :key="children.name+'_'+index" :name="children.name+'_'+index" :to="{ name: children.component}" @click.native="reload()">{{children.name}}</MenuItem>
            </Submenu>
          </Menu>
        </Sider>
        <!-- 内容主体区域 -->
        <Layout :style="{padding: '0 24px 24px'}">
          <Content :style="{padding: '24px', minHeight: '800px', minWidth: '1000px', background: '#fff'}">
            <router-view v-if="isRouterAlive"></router-view>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>

<script>
  export default {
    name: 'layout',
    components: {},
    data() {
      return {
        isRouterAlive: true,
        passwordForm:{
          username:'',
          oldpw:'',
          newpw:'',
          newpws:''
        },
        staffForm:{
          username:'',
          staffSex:'',
          staffTel:'',
          idNumber:'',
          staffName:'',
          deptName:'',
          entryTime:''
        },
        modal : false,
        modal2 : false,
        menus:[],
        ruleValidate: {
          oldpw: [{
            required: true,
            message: '旧密码不能为空',
            trigger: 'blur'
          }],
          newpw: [{
            required: true,
            message: '新密码不能为空',
            trigger: 'blur'
          }],
          newpws: [{
            required: true,
            message: '确认密码不能为空',
            trigger: 'blur'
          }]
        },
        username:''
      }
    },
    created() {
      this.passwordForm.username = JSON.parse(localStorage.getItem("TOKEN")).username
      this.username = JSON.parse(localStorage.getItem("TOKEN")).username
      this.menus = JSON.parse(localStorage.getItem("TOKEN")).menus
    },
    methods: {
      //局部刷新路由
      reload() {
        this.isRouterAlive = false
        this.$nextTick(() => (this.isRouterAlive = true))
      },
      passwordPannel(){
        this.modal = true;
      },
      logout(){
        this.$http({
          url:'/logout',
          method:'GET'
        })
        .then((res) => {
          if (res.data.status === 200) {
            localStorage.removeItem("TOKEN")
            this.$router.push({ 
                path: '/'
              });
            this.$Message.info(res.data.data)
          }else if (res.data.status === 500) {
            this.$Message.info(res.data.msg)
          }
        })
        .catch((err) => {
          console.log(err);
        });
      },
      yes(){
        this.$refs.passwordForm.validate(valid=>{
          if (valid) {
            if (this.passwordForm.newpw !== this.passwordForm.newpws) {
              this.$Message.info('确认密码与新密码不一致');
            }else{
              this.$http({
                url:'staff/updatePW',
                method:'POST',
                data:this.passwordForm
              })
              .then((res) => {
                if (res.data.status === 200) {
                  this.$Message.info(res.data.data)
                  this.modal = false;
                  this.$refs.passwordForm.resetFields();
                }else if (res.data.status === 500) {
                  this.$Message.info(res.data.msg)
                }
              })
              .catch((err) => {
                console.log(err);  
              });
            }  
          }
        })
      },
      no(){
        this.$refs.passwordForm.resetFields();
        this.modal = false;
      },
      getStaffByUsername(){
        this.$http({
          url:'staff/getStaffByUsername2',
          method:'GET',
          params:{
            username:this.username
          }
        })
        .then((res) => {
          if (res.data.status === 200) {
            this.staffForm = res.data.data
            this.staffForm.entryTime = this.moment(this.staffForm.entryTime).format('YYYY-MM-DD')
            this.modal2 = true
          }else if (res.data.status === 500) {
            this.$Message.info(res.data.msg)
          }
        })
        .catch((err) => {
          console.log(err);
        });
      },
      close(){
        this.modal2 = false;
      }
    },
  }

</script>
