<style scoped>
  #btn-box {
    text-align: left;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  #page-box {
    margin-top: 10px;
  }

</style>
<template>
  <div id="deptEdit">
    <div style="background:#eee;padding:20px">
      <Card :bordered="false">
        <div id="cardItem">
          <Input v-model="conditionForm.deptId" placeholder="请输入科室编号" clearable
            style="width: 200px; margin-right:5px" />
          <Input v-model="conditionForm.deptName" placeholder="请输入科室名称" clearable
            style="width: 200px;margin-right:5px" />
          <Input v-model="conditionForm.director" placeholder="请输入主任姓名" clearable
            style="width: 200px;margin-right:5px" />
          <Button class="search-btn" type="primary" shape="circle" icon="ios-search" @click="getDept()"></Button>
        </div>
      </Card>
    </div>
    <div id="btn-box">
      <Button type="primary" @click="showAddPanel">新增</Button>
      <Modal :mask-closable="false" :closable="false" v-model="modal" title="新增科室">
        <Form ref="addForm" :rules="ruleValidate" :model="addForm" label-colon=":" label-position="right"
          :label-width="100">
          <FormItem label="科室编号" prop="deptId">
            <Input v-model="addForm.deptId" />
          </FormItem>
          <FormItem label="科室名称" prop="deptName">
            <Input v-model="addForm.deptName" />
          </FormItem>
          <FormItem label="科室描述" prop="describe">
            <Input type="textarea" :row="3" v-model="addForm.describe" />
          </FormItem>
          <FormItem label="科室主任" prop="director">
            <Input v-model="addForm.director" />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="add()">添加</Button>
          <Button @click="cancelAdd()">取消</Button>
        </div>
      </Modal>
      <Modal :mask-closable="false" :closable="false" v-model="modal2" title="科室更改">
        <Form ref="updateForm" :rules="ruleValidate" :model="updateForm" label-colon=":" label-position="right"
          :label-width="100">
          <input type="hidden" v-model="updateForm.deptId" />
          <FormItem label="科室编号" prop="deptId">
            <Input v-model="updateForm.newDeptId" />
          </FormItem>
          <FormItem label="科室名称" prop="deptName">
            <Input v-model="updateForm.deptName" />
          </FormItem>
          <FormItem label="科室描述" prop="describe">
            <Input type="textarea" :row="3" v-model="updateForm.describe" />
          </FormItem>
          <FormItem label="科室主任" prop="director">
            <Input v-model="updateForm.director" />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="updated()">更改</Button>
          <Button @click="cancelUpdate()">取消</Button>
        </div>
      </Modal>
      <Modal :mask-closable="false" :closable="false" v-model="modal3" title="提示">
        此操作将无法恢复！且该部门下所有员工信息将删除！您确定要删除吗？
        <div slot="footer">
          <Button type="error" @click="delDept()">删除</Button>
          <Button @click="cancelDel()">取消</Button>
        </div>
      </Modal>
    </div>
    <div>
      <Table :columns="columns" :data="data">
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="update(index)">更改</Button>
          <Button type="error" size="small" style="margin-right: 5px" @click="del(index)">删除</Button>
        </template>
      </Table>
    </div>
    <!-- 分页模块 -->
    <div id="page-box">
      <Page :total="total" :page-size="11" show-elevator @on-change="pageChange" />
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        columns: [{
            title: '操作',
            slot: 'action',
            width: 200,
            align: 'center'
          },
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '科室编号',
            key: 'deptId'
          },
          {
            title: '科室名称',
            key: 'deptName'
          },
          {
            title: '科室人员数量',
            key: 'staffNumber'
          },
          {
            title: '科室描述',
            key: 'describe',
            render:(h, params) => {
              return h('div', [
                h('span', {
                  style: {display: 'inline-block', 
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'},
                  domProps: {title: params.row.describe},
                  on:{click:(e) => { e.stopPropagation();}}
                }, params.row.describe)
              ]);
          }
          },
          {
            title: '科室主任',
            key: 'director'
          }
        ],
        data: [],
        modal: false,
        modal2: false,
        modal3: false,
        total: 0,
        conditionForm: {
          deptId: '',
          deptName: '',
          director: ''
        },
        addForm: {
          deptId: '',
          deptName: '',
          describe: '',
          director: ''
        },
        updateForm: {
          deptId: '',
          newDeptId: '',
          deptName: '',
          describe: '',
          director: ''
        },
        delDeptId: '',
        ruleValidate: {
          deptId: [{
            required: true,
            message: '科室编号不能为空',
            trigger: 'blur'
          }],
          deptName: [{
            required: true,
            message: '科室名不能为空',
            trigger: 'blur'
          }],
          describe: [{
            required: true,
            message: '科室描述不能为空',
            trigger: 'change'
          }]
        }
      }
    },
    created() {
      this.getDept();
    },
    methods: {
      getDept() {
        this.$http({
            url: 'dept/getDept',
            method: 'GET',
            params: this.conditionForm
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.data = res.data.data.list
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
            url: 'dept/getDept',
            method: 'GET',
            params: {
              deptName: this.conditionForm.deptName,
              deptId: this.conditionForm.deptId,
              director: this.conditionForm.director,
              pageNum: pageNum
            }
          })
          .then((res) => {
            if (res.data.status === 200) {
              console.log(res);
              this.data = res.data.data.list
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      showAddPanel() {
        this.modal = true;
      },
      add() {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            this.$http({
                url: 'dept/addDept',
                method: 'POST',
                data: this.addForm
              })
              .then((res) => {
                if (res.data.status === 200) {
                  this.modal = false
                  this.$refs.addForm.resetFields()
                  this.$Message.info(res.data.data)
                  this.getDept()
                } else if (res.data.status === 500) {
                  this.modal = false
                  this.$refs.addForm.resetFields()
                  this.$Message.info(res.data.msg)
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })

      },
      cancelAdd() {
        this.$refs.addForm.resetFields()
        this.modal = false
      },
      update(index) {
        this.updateForm = {
          deptId: this.data[index].deptId,
          newDeptId: this.data[index].deptId,
          deptName: this.data[index].deptName,
          describe: this.data[index].describe,
          director: this.data[index].director
        }
        this.modal2 = true;
      },
      updated() {
        this.$refs.updateForm.validate(valid => {
          if (valid) {
            this.$http({
                url: 'dept/updateDeptByDeptId',
                method: 'POST',
                data: this.updateForm
              })
              .then((res) => {
                if (res.data.status === 200) {
                  this.modal2 = false
                  this.$Message.info(res.data.data)
                  this.getDept()
                } else if (res.data.status === 500) {
                  this.modal2 = false
                  this.$refs.updateForm.resetFields();
                  this.$Message.info(res.data.msg)
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })


      },
      cancelUpdate() {
        this.$refs.updateForm.resetFields();
        this.modal2 = false
      },
      del(index) {
        this.delDeptId = this.data[index].deptId
        this.modal3 = true
      },
      delDept() {
        this.$http({
            url: 'dept/delDeptByDeptId',
            method: 'DELETE',
            params: {
              deptId: this.delDeptId
            }
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.model3 = false;
              this.$Message.info(res.data.data)
              this.getDept()
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      cancelDel() {
        this.modal3 = false
        this.delDeptId = ''
      }
    }
  }

</script>
