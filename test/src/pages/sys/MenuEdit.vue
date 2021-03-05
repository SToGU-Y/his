<style scoped>
  .btn-box {
    text-align: left;
    margin: 5px;
  }

  .page-box {
    margin-top: 10px;
  }

</style>
<template>
  <div id="menuEdit">
    <!-- 条件查询区域 -->
    <div id="select-box">
      <div style="background:#eee;padding:20px">
        <Card :bordered="false">
          <div id="cardItem">
            <Input v-model="conditionForm.id" placeholder="请输入菜单编号" clearable style="width: 200px; margin-right:5px" />
            <Input v-model="conditionForm.name" placeholder="请输入菜单名称" clearable
              style="width: 200px; margin-right:5px" />
            <Button class="search-btn" type="primary" shape="circle" icon="ios-search"
              @click="getAllMenusByPage"></Button>
          </div>
        </Card>
      </div>
    </div>
    <div class="btn-box">
      <Button type="primary" @click="modal = true">新增</Button>

      <Modal :mask-closable="false" :closable="false" v-model="modal" title="添加角色">
        <Form ref="addForm" label-colon=":" :rules="ruleValidate" label-position="right" :label-width="100"
          :model="addForm">
          <FormItem label="菜单编号" prop="id">
            <Input type="number" v-model="addForm.id" />
          </FormItem>
          <FormItem label="菜单名称" prop="name">
            <Input v-model="addForm.name" />
          </FormItem>
          <FormItem label="url" prop="url">
            <Input v-model="addForm.url" />
          </FormItem>
          <FormItem label="路径" prop="path">
            <Input v-model="addForm.path" />
          </FormItem>
          <FormItem label="父菜单编号" prop="parentId">
            <Input type="number" v-model="addForm.parentId" />
          </FormItem>
          <FormItem label="菜单图标" prop="iconCls">
            <Input v-model="addForm.iconCls" />
          </FormItem>
          <FormItem label="菜单组件" prop="component">
            <Input v-model="addForm.component" />
          </FormItem>
          <FormItem label="角色" prop="roleId">
            <Select v-model="addForm.roleId">
              <Option v-for="role in roleList" :value="role.roleId" :key="role.roleId">{{ role.roleName}}</Option>
            </Select>
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
          <Button type="primary" @click="edit(index)">更改</Button>
          <Button type="error" @click="check(index)">删除</Button>
        </template>
      </Table>

      <Modal :mask-closable="false" :closable="false" v-model="modal3" title="提示">
        此操作无法恢复，删除该菜单后相应操作会无法正常进行，请确定是否删除！
        <div slot="footer">
          <Button type="primary" @click="del()">删除</Button>
          <Button @click="cancel()">取消</Button>
        </div>
      </Modal>


      <Modal :mask-closable="false" :closable="false" v-model="modal2" title="更改">
        <Form ref="updateForm" label-colon=":" :rules="ruleValidate" label-position="right" :label-width="100"
          :model="updateForm">
          <FormItem label="菜单编号" prop="id">
            <Input disabled v-model="updateForm.id" />
          </FormItem>
          <FormItem label="菜单名称" prop="name">
            <Input v-model="updateForm.name" />
          </FormItem>
          <FormItem label="url" prop="url">
            <Input v-model="updateForm.url" />
          </FormItem>
          <FormItem label="路径" prop="path">
            <Input v-model="updateForm.path" />
          </FormItem>
          <FormItem label="父菜单编号" prop="parentId">
            <Input type="number" v-model="updateForm.parentId" />
          </FormItem>
          <FormItem label="菜单图标" prop="iconCls">
            <Input v-model="updateForm.iconCls" />
          </FormItem>
          <FormItem label="菜单组件" prop="component">
            <Input v-model="updateForm.component" />
          </FormItem>
        </Form>
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
            id:[{
                required:true,
                message: '编号不能为空',
                trigger: 'blur',
                type:'number'
            }],
          name: [{
            required: true,
            message: '菜单名称不能为空',
            trigger: 'blur'
          }],
          roleId: [{
            required: true,
            message: '角色不能为空',
            type:'number',
            trigger: 'blur'
          }]
        },
        total: 0,
        roleList:[],
        modal: false,
        modal2: false,
        modal3: false,
        addForm: {
            id:'',
          name: '',
          url: '',
          component: '',
          path: '',
          iconCls: '',
          parentId: '',
          roleId:''
        },
        updateForm: {
            id:'',
          name: '',
          url: '',
          component: '',
          path: '',
          iconCls: '',
          parentId: ''
        },
        conditionForm: {
          id: '',
          name: ''
        },
        columns: [{
            title: '编号',
            key: 'id',
            align: 'center'
          },
          {
            title: 'url',
            key: 'url',
            render:(h, params) => {
              return h('div', [
                h('span', {
                  style: {display: 'inline-block', 
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'},
                  domProps: {title: params.row.url},
                  on:{click:(e) => { e.stopPropagation();}}
                }, params.row.url)
              ]);
          }
          },
          {
            title: '路径',
            key: 'path'
          },
          {
            title: '菜单名称',
            key: 'name',
            render:(h, params) => {
              return h('div', [
                h('span', {
                  style: {display: 'inline-block', 
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'},
                  domProps: {title: params.row.name},
                  on:{click:(e) => { e.stopPropagation();}}
                }, params.row.name)
              ]);
          }
          },
          {
            title: '菜单组件',
            key: 'component',
            render:(h, params) => {
              return h('div', [
                h('span', {
                  style: {display: 'inline-block', 
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'},
                  domProps: {title: params.row.component},
                  on:{click:(e) => { e.stopPropagation();}}
                }, params.row.component)
              ]);
          }
          },
          {
            title: '父菜单编号',
            key: 'parentId'
          },
          {
            title: '图标',
            key: 'iconCls',
            render:(h, params) => {
              return h('div', [
                h('span', {
                  style: {display: 'inline-block', 
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'},
                  domProps: {title: params.row.iconCls},
                  on:{click:(e) => { e.stopPropagation();}}
                }, params.row.iconCls)
              ]);
          }
          },
          {
            title: '操作',
            width: 200,
            align: 'center',
            slot: 'action'
          }
        ],
        data: [],
        username: '',
        delMenuId:''
      }
    },

    created() {
      this.username = JSON.parse(localStorage.getItem("TOKEN")).username
      this.getAllMenusByPage()
      this.getRole();
    },

    methods: {
      getAllMenusByPage() {
        this.$http({
            url: 'menu/getAllMenusByPage',
            method: 'GET',
            params: this.conditionForm
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.data = res.data.data.list;
              this.total = res.data.data.total
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
            url: 'menu/getAllMenusByPage',
            method: 'GET',
            params: {
              id: this.conditionForm.id,
              name: this.conditionForm.name,
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
      getRole() {
        this.$http({
            url: 'role/getRoles',
            method: 'GET'
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.roleList = res.data.data
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      check(index) {
        this.modal3 = true;
        this.delMenuId = this.data[index].id;
      },
      edit(index){
          this.updateForm.id = this.data[index].id
          this.updateForm.name = this.data[index].name
          this.updateForm.url = this.data[index].url
          this.updateForm.component = this.data[index].component
          this.updateForm.path = this.data[index].path
          this.updateForm.iconCls = this.data[index].iconCls
          this.updateForm.parentId = this.data[index].parentId
          this.modal2 = true;
      },
      update(){
          this.$refs.updateForm.validate(valid => {
          if (valid) {
            this.$http({
                url: 'menu/updateMenu',
                method: 'POST',
                data: this.updateForm
              })
              .then((res) => {
                if (res.data.status === 200) {
                  this.$Message.info(res.data.data)
                  this.$refs.updateForm.resetFields()
                  this.modal2 = false;
                  this.getAllMenusByPage()
                } else if (res.data.status === 500) {
                  this.$Message.info(res.data.msg)
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
      },
      del() {
        this.$http({
            url: 'menu/delMenu',
            method: 'DELETE',
            params: {
              id: this.delMenuId
            }
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.$Message.info(res.data.data)
              this.modal3 = false;
              this.delMenuId = ''
              this.getAllMenusByPage()
            } else if (res.data.status === 500) {
              this.modal3 = false;
              this.$Message.info(res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      cancel() {
        this.modal3 = false;
        this.delMenuId = ''
      },
      cancelAdd() {
        this.modal = false;
      },
      add() {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            this.$http({
                url: 'menu/addMenu',
                method: 'POST',
                data: this.addForm
              })
              .then((res) => {
                if (res.data.status === 200) {
                  this.$Message.info(res.data.data)
                  this.$refs.addForm.resetFields()
                  this.getAllMenusByPage();
                  this.modal = false;
                } else if (res.data.status === 500) {
                  this.$Message.info(res.data.msg)
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
      }
    }
  }

</script>
