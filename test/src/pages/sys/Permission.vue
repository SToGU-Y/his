<style scoped>
  .btn-box {
    text-align: left;
    margin-bottom: 5px;
  }

  .page-box {
    margin-top: 10px;
  }

</style>
<template>
  <div id="permission">
    <div class="btn-box">
      <Button type="primary" @click="modal = true">新增</Button>

      <Modal :mask-closable="false" :closable="false" v-model="modal" title="添加角色">
        <Form ref="addForm" label-colon=":" :rules="ruleValidate" label-position="right" :label-width="100"
          :model="addForm">
          <FormItem label="角色名称" prop="roleName">
            <Input v-model="addForm.roleName" />
          </FormItem>
          <FormItem label="角色描述" prop="roleDescribe">
            <Input v-model="addForm.roleDescribe" />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="add()">新增</Button>
          <Button @click="cancelAdd()">取消</Button>
        </div>
      </Modal>

    </div>
    <div class="table-box">
      <Table border :columns="columns" :data="data">
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" @click="edit(index)">编辑</Button>
          <Button type="error" @click="check(index)">删除</Button>
        </template>
      </Table>

      <Modal :mask-closable="false" :closable="false" v-model="modal3" title="提示">
        此操作无法恢复，删除该角色后相应员工会无法正常操作，请确定是否删除！
        <div slot="footer">
          <Button type="primary" @click="del()">删除</Button>
          <Button @click="cancel()">取消</Button>
        </div>
      </Modal>

    <Modal :mask-closable="false" :closable="false" v-model="modal2" title="编辑权限">
        <Tree :data="permissionData" show-checkbox ref="permissionTree" @on-check-change="checkChange"></Tree>
        <div slot="footer">
          <Button type="primary" @click="update()">更改</Button>
          <Button @click="close()">取消</Button>
        </div>
    </Modal>
     
    </div>

    <!-- 分页组件 -->
    <div class="page-box">
      <Page :total="total" show-elevator @on-change="pageChange" />
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        ruleValidate: {
          roleName: [{
            required: true,
            message: '角色名称不能为空',
            trigger: 'blur'
          }],
          roleDescribe: [{
            required: true,
            message: '角色描述不能为空',
            trigger: 'blur'
          }]
        },
        total: 0,
        modal: false,
        modal2: false,
        modal3: false,
        addForm:{
            roleName:'',
            roleDescribe:''
        },
        columns: [{
            title: '编号',
            key: 'roleId'
          },
          {
            title: '角色名称',
            key: 'roleName'
          },
          {
            title: '描述',
            key: 'roleDescribe'
          },
          {
            title: '操作',
            slot: 'action'
          }
        ],
        data: [],
        allMenu: [],
        usernameMenu:[],
        roleMenu:[],
        permissionData:[
            {
                title:'住院系统菜单',
                expand: true,
                children:[]
            }
        ],
        menuIds:[],
        username:'',
        roleId:'',
        delRoleId:''
      }
    },

    created() {
        this.username = JSON.parse(localStorage.getItem("TOKEN")).username
        this.getRole();
        this.getMenuByUsername()
        this.getMenu()
    },

    methods: {
      getRole() {
        this.$http({
            url: 'role/getRolesByPage',
            method: 'GET'
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.data = res.data.data.list;
              this.total = res.data.data.total;
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      pageChange(pageNum) {
        this.$http({
            url: 'role/getRolesByPage',
            method: 'GET',
            params: {
              pageNum: pageNum
            }
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.data = res.data.data.list;
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      edit(index){
        this.roleId = this.data[index].roleId;
        this.$http({
              url:'menu/getMenuByRoleId',
              method:'GET',
              params:{
                  roleId:this.data[index].roleId
              }
          })
          .then((res) => {
              if (res.data.status === 200) {
                this.roleMenu = res.data.data
                this.initPermissionData()
                this.modal2 = true
              }else if (res.data.status === 500) {
                  this.$Message.info(res.data.msg)
              }
          })
          .catch((err) => {
              console.log(err);
          });
      },
      getMenuByUsername(){
        this.$http({
          url:'menu/getMenuByUsername',
          method:'GET',
          params:{
            username:this.username
          }
        })
        .then((res) => {
          if (res.data.status === 200) {
            this.usernameMenu = res.data.data
          }else if (res.data.status === 500) {
            this.$Message.info(res.data.msg)
          }
        })
        .catch((err) => {
          console.log(err);
        });
      },
      check(index){
        this.modal3 = true;
        this.delRoleId = this.data[index].roleId;
      },
      del(){
        this.$http({
          url:'role/delRole',
          method:'DELETE',
          params:{
            roleId:this.delRoleId
          }
        })
        .then((res) => {
          if (res.data.status === 200) {
            this.$Message.info(res.data.data)
            this.modal3 = false;
            this.delRoleId = ''
            this.getRole()
          }else if (res.data.status === 500) {
            this.$Message.info(res.data.msg)
          }
        })
        .catch((err) => {
          console.log(err);
        });
      },
      cancel(){
        this.modal3 = false;
        this.delRoleId = ''
      },
      cancelAdd(){
          this.modal = false;
      },
      add(){
          this.$refs.addForm.validate(valid=>{
              if (valid) {
                  this.$http({
                    url:'role/addRole',
                    method:'POST',
                    data:this.addForm
                  })
                  .then((res) => {
                    if (res.data.status === 200) {
                      this.$Message.info(res.data.data)
                      this.$refs.addForm.resetFields();
                      this.modal = false;
                    }else if (res.data.status === 500) {
                      this.$Message.info(res.data.msg)
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
          })
      },
      getMenu(){
          this.$http({
              url:'menu/getAllMenus',
              method:'GET',
          })
          .then((res) => {
            if (res.data.status === 200) {
                this.allMenu = res.data.data
            }else if (res.data.status === 500) {
                this.$Message.info(res.data.msg)
            }    
          })
          .catch((err) => {
              console.log(err);
          });
      },
      update(){
        if (this.roleId === '') {
          this.$Message.info("请刷新页面重试")
          return
        }
        var mids = []
        if (this.menuIds.length > 0) {
          this.menuIds.forEach(element => {
            mids.push(element.id)
          });
        }
        this.$http({
          url:'menu/MenuRoleChange',
          method:'POST',
          data:{
            roleId:this.roleId,
            menuIds:mids
          }
        })
        .then((res) => {
          if (res.data.status === 200) {
            this.$Message.info(res.data.data)
            this.modal2 = false;
            this.menuIds = []
          }else if (res.data.status === 500) {
            this.$Message.info(res.data.msg)
          }
        })
        .catch((err) => {
          console.log(err);
        });
      },
      close(){
        this.permissionData=[
          {
            title:'住院系统菜单',
            expend: true,
            children:[]
          }
        ]
        this.modal2 = false;
      },
      initPermissionData(){
          var moduleChildren = []
          this.allMenu.forEach(module => {
              this.usernameMenu.forEach(permission => {
                if (permission.id === module.id) {
                  var permissionId = permission.id
                  var tempModuleChildren = {}
                  tempModuleChildren.title = module.name   
                  tempModuleChildren.expand = true;
                  var permissionChildren = []
                  module.children.forEach(element => {
                    permission.children.forEach(element2 => {
                      var checked = false;
                      if (element2.id === element.id) {
                        var tempPermissionChildren = {}
                        tempPermissionChildren.title = element2.name  
                        tempPermissionChildren.expand = true;  
                        this.roleMenu.forEach(multi => {
                          if (multi.id === permissionId) {
                            multi.children.forEach(element3 => {
                              if (element3.id === element2.id) {
                                  checked = true;
                               } 
                          });
                          }
                        });
                        tempPermissionChildren.id = element2.id;
                        tempPermissionChildren.checked = checked
                        permissionChildren.push(tempPermissionChildren)
                      }
                    });
                  });
                  tempModuleChildren.children = permissionChildren
                  tempModuleChildren.id = module.id
                  moduleChildren.push(tempModuleChildren)
                }
              });
          });
          this.permissionData[0].children = moduleChildren
      },
      checkChange(params){
        this.menuIds = params;
      }
    }
  }

</script>
