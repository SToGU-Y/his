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
                <DropdownItem>用户信息</DropdownItem>
                <DropdownItem>修改密码</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </Menu>
      </Header>
      <!-- 侧边栏区域 -->
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu width="auto">
            <Submenu name="1">
              <template slot="title">
                <Icon type="ios-people" />
                病人管理
              </template>
              <MenuItem name="1-1" :to="{ name: 'Patient'}" @click.native="reload()">病人信息</MenuItem>
              <MenuItem name="1-2" :to="{ name: ''}" @click.native="reload()">在院病人管理</MenuItem>
            </Submenu>
            <Submenu name="11">
              <template slot="title">
                <Icon type="ios-pulse" />
                床位管理
              </template>
              <MenuItem name="11-1" :to="{ name: 'Bed'}">床位信息</MenuItem>
              <MenuItem name="11-2" :to="{ name: 'BedSelect'}">床位选择</MenuItem>
              <MenuItem name="11-2" :to="{ name: 'BedSelect'}">更换病床</MenuItem>
            </Submenu>
            <Submenu name="17">
              <template slot="title">
                <Icon type="ios-pulse" />
                病房管理
              </template>
              <MenuItem name="17-1" :to="{ name: 'Ward'}">病房信息</MenuItem>
              <MenuItem name="17-2" :to="{ name: 'WardType'}">病房类型</MenuItem>
            </Submenu>
            <MenuItem name="2" :to="{ name: 'Registration'}" @click.native="reload()">
            <Icon type="ios-person-add" />入院登记</MenuItem>
            <Submenu name="6">
              <template slot="title">
                <Icon type="ios-paper" />
                医嘱管理
              </template>
              <MenuItem name="6-1" :to="{ name: 'MedicalAdviceQuery'}" @click.native="reload()">医嘱查询</MenuItem>
              <MenuItem name="6-2" :to="{ name: 'MedicalAdvice'}" @click.native="reload()">添加医嘱</MenuItem>
            </Submenu>
            <Submenu name="10">
              <template slot="title">
                <Icon type="ios-clipboard-outline" />
                病历管理
              </template>
              <MenuItem name="10-1" :to="{ name: ''}">病历信息</MenuItem>
              <MenuItem name="10-2" :to="{ name: ''}">病历书写</MenuItem>
            </Submenu>
            <Submenu name="9">
              <template slot="title">
                <Icon type="logo-yen" />
                费用管理
              </template>
              <MenuItem name="9-1" :to="{ name: ''}">费用清单</MenuItem>
              <MenuItem name="9-2" :to="{ name: ''}">住院费用</MenuItem>
              <MenuItem name="9-3" :to="{ name: ''}">预押金退款</MenuItem>
              <MenuItem name="9-2" :to="{ name: ''}">预交押金情况查询</MenuItem>
            </Submenu>
            <Submenu name="4">
              <template slot="title">
                <Icon type="ios-medkit-outline" />
                药品管理
              </template>
              <MenuItem name="4-1" :to="{ name: ''}">药品信息</MenuItem>
              <MenuItem name="4-2" :to="{ name: ''}">药品入库</MenuItem>
            </Submenu>
            <Submenu name="5">
              <template slot="title">
                <Icon type="ios-hammer" />
                器械管理
              </template>
              <MenuItem name="5-1" :to="{ name: ''}">器械信息</MenuItem>
              <MenuItem name="5-2" :to="{ name: ''}">器械入库</MenuItem>
              <MenuItem name="5-3" :to="{ name: ''}">器械调用</MenuItem>
            </Submenu>
            <Submenu name="13">
              <template slot="title">
                <Icon type="ios-body" />
                处置管理
              </template>
              <MenuItem name="13-1" :to="{ name: ''}">处置添加</MenuItem>
              <MenuItem name="13-2" :to="{ name: ''}">处置删除</MenuItem>
              <MenuItem name="13-3" :to="{ name: ''}">处置修改</MenuItem>
            </Submenu>
            <Submenu name="8">
              <template slot="title">
                <Icon type="ios-walk" />
                出院办理
              </template>
              <MenuItem name="8-1" :to="{ name: ''}">出院办理</MenuItem>
            </Submenu>
            <Submenu name="7">
              <template slot="title">
                <Icon type="ios-man" />员工管理</template>
              <MenuItem name="7-1" :to="{ name: ''}">新增员工</MenuItem>
              <MenuItem name="7-2" :to="{ name: ''}">员工离职</MenuItem>
            </Submenu>
            <Submenu name="12">
              <template slot="title">
                <Icon type="ios-apps" />
                科室管理
              </template>
              <MenuItem name="12-1" :to="{ name: ''}">科室查询</MenuItem>
              <MenuItem name="12-2" :to="{ name: ''}">科室添加</MenuItem>
              <MenuItem name="12-3" :to="{ name: ''}">科室移除</MenuItem>
            </Submenu>
            <Submenu name="14">
              <template slot="title">
                <Icon type="ios-settings" />
                系统管理
              </template>
              <MenuItem name="14-1" :to="{ name: ''}">权限管理</MenuItem>
              <MenuItem name="14-2" :to="{ name: ''}">系统日志</MenuItem>
              <MenuItem name="14-3" :to="{ name: ''}">别的功能吧</MenuItem>
            </Submenu>
            <Submenu name="15">
              <template slot="title">
                <Icon type="ios-search" />
                信息查询
              </template>
              <MenuItem name="15-1" :to="{ name: ''}">费用查询</MenuItem>
              <MenuItem name="15-2" :to="{ name: ''}">医嘱查询</MenuItem >
              <MenuItem name="15-3">住院信息查询</MenuItem>
              <MenuItem name="15-3">医生查询</MenuItem>
              <MenuItem name="15-4" :to="{ name: ''}">记录查询</MenuItem>
            </Submenu>
            <Submenu name="3">
              <template slot="title">
                <Icon type="ios-stats" />
                统计分析
              </template>
              <MenuGroup title="日结">
                <MenuItem name="3-3" :to="{ name: ''}">本日总结</MenuItem>
              </MenuGroup>
              <MenuGroup title="月结">
                <MenuItem name="3-4" :to="{ name: ''}">本月总结</MenuItem>
              </MenuGroup>
              <MenuGroup title="病况">
                <MenuItem name="3-5" :to="{ name: ''}">住院总人数情况</MenuItem>
                <MenuItem name="3-6" :to="{ name: ''}">科室住院人数情况</MenuItem>
              </MenuGroup>
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
        isRouterAlive: true
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
