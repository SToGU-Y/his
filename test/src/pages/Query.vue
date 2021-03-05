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
        </Menu>
      </Header>
      <!-- 侧边栏区域 -->
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu width="auto">
            <Submenu name="15">
              <template slot="title">
                <Icon type="ios-search" />
                信息查询
              </template>
              <MenuItem name="15-1" :to="{ name: 'PatientCostQuery'}">费用查询</MenuItem>
              <MenuItem name="15-2" :to="{ name: 'PatientDepositQuery'}">预缴查询</MenuItem >
              <MenuItem name="15-3" :to="{ name: 'PatientInpatientQuery'}">住院记录查询</MenuItem>
              <MenuItem name="15-4" :to="{ name: 'PatientMedicalRecordQuery'}">病历查询</MenuItem>
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
    name: 'Query',
    data() {
      return {
        isRouterAlive: true,
      }
    },
    methods: {
      //局部刷新路由
      reload() {
        this.isRouterAlive = false
        this.$nextTick(() => (this.isRouterAlive = true))
      }
    },
  }


</script>
