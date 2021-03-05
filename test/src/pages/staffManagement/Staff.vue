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
  <div id="staff">
    <div style="background:#eee;padding:20px">
      <Card :bordered="false">
        <div id="cardItem">
          <Select filterable clearable v-model="conditionForm.deptName" style="width:200px">
            <Option v-for="item in deptList" :value="item.deptName" :key="item.deptName">{{ item.deptName }}</Option>
          </Select>
          <Input v-model="conditionForm.username" placeholder="请输入工号" clearable
            style="width: 200px; margin-right:5px" />
          <Input v-model="conditionForm.idNumber" placeholder="请输入身份证号" clearable
            style="width: 200px;margin-right:5px" />
          <Input v-model="conditionForm.staffName" placeholder="请输入员工姓名" clearable
            style="width: 200px;margin-right:5px" />
          <Button class="search-btn" type="primary" shape="circle" icon="ios-search" @click="getStaff()"></Button>
        </div>
      </Card>
    </div>
    <div id="btn-box">
      <Button type="primary" @click="showAddPanel">新增</Button>
      <Button type="primary" @click="modal3 = true">重置密码</Button>
      <Modal :mask-closable="false" :closable="false" v-model="modal3" title="重置密码">
        <Form ref="reset" label-colon=":" :rules="ruleValidate2" label-position="right" :label-width="100"
          :model="resetForm">
          <FormItem label="工号" prop="username">
            <Input v-model="resetForm.username" />
          </FormItem>
          <FormItem label="重置密码" prop="password">
            <Input type="password" v-model="resetForm.password" />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="reset()">重置</Button>
          <Button @click="resetCancel">取消</Button>
        </div>
      </Modal>
      <Modal :mask-closable="false" :closable="false" v-model="modal" title="添加员工">
        <Form ref="addForm" :rules="ruleValidate" :model="addForm" label-colon=":" label-position="right"
          :label-width="100">
          <FormItem label="工号" prop="username">
            <Input v-model="addForm.username" />
          </FormItem>
          <FormItem label="姓名" prop="staffName">
            <Input v-model="addForm.staffName" />
          </FormItem>
          <FormItem label="出生年月" prop="staffBirth">
            <DatePicker v-model="addForm.staffBirth"></DatePicker>
          </FormItem>
          <FormItem label="性别" prop="staffSex">
            <Select v-model="addForm.staffSex">
              <Option value="男">男</Option>
              <Option value="女">女</Option>
            </Select>
          </FormItem>
          <FormItem label="民族" prop="staffNation">
            <Select v-model="addForm.staffNation">
              <Option v-for="nation in nationList" :value="nation.nationName" :key="nation.nationName">
                {{nation.nationName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="婚况" prop="staffMarried">
            <Input v-model="addForm.staffMarried" />
          </FormItem>
          <FormItem label="初始密码" prop="password">
            <Input type="password" v-model="addForm.password" />
          </FormItem>
          <FormItem label="身份证号" prop="idNumber">
            <Input v-model="addForm.idNumber" />
          </FormItem>
          <FormItem label="所属科室" prop="deptName">
            <Select v-model="addForm.deptName">
              <Option v-for="dept in deptList" :value="dept.deptName" :key="dept.deptName">{{dept.deptName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="居住地址" prop="staffAddr">
            <Input v-model="addForm.staffAddr" />
          </FormItem>
          <FormItem label="联系电话" prop="staffTel">
            <Input v-model="addForm.staffTel" />
          </FormItem>
          <FormItem label="角色" prop="role">
            <Select multiple v-model="addForm.role">
              <Option v-for="role in roleList" :value="role.roleId" :key="role.roleId">{{ role.roleName}}</Option>
            </Select>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="add()">添加</Button>
          <Button @click="cancelAdd()">取消</Button>
        </div>
      </Modal>
      <Modal :mask-closable="false" :closable="false" v-model="modal2" title="信息更改">
        <Form ref="updateForm" :rules="ruleValidate" :model="updateForm" label-colon=":" label-position="right"
          :label-width="100">
          <FormItem label="工号" prop="username">
            <Input disabled v-model="updateForm.username" />
          </FormItem>
          <FormItem label="姓名" prop="staffName">
            <Input v-model="updateForm.staffName" />
          </FormItem>
          <FormItem label="出生年月" prop="staffBirth">
            <DatePicker v-model="updateForm.staffBirth"></DatePicker>
          </FormItem>
          <FormItem label="性别" prop="staffSex">
            <Select v-model="updateForm.staffSex">
              <Option value="男">男</Option>
              <Option value="女">女</Option>
            </Select>
          </FormItem>
          <FormItem label="民族" prop="staffNation">
            <Select v-model="updateForm.staffNation">
              <Option v-for="nation in nationList" :value="nation.nationName" :key="nation.nationName">
                {{nation.nationName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="婚况" prop="staffMarried">
            <Input v-model="updateForm.staffMarried" />
          </FormItem>
          <FormItem label="身份证号" prop="idNumber">
            <Input v-model="updateForm.idNumber" />
          </FormItem>
          <FormItem label="所属科室" prop="deptName">
            <Select v-model="updateForm.deptName">
              <Option v-for="dept in deptList" :value="dept.deptName" :key="dept.deptName">{{dept.deptName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="居住地址" prop="staffAddr">
            <Input v-model="updateForm.staffAddr" />
          </FormItem>
          <FormItem label="联系电话" prop="staffTel">
            <Input v-model="updateForm.staffTel" />
          </FormItem>
          <FormItem label="角色" prop="role">
            <Select multiple v-model="updateForm.role">
              <Option v-for="role in roleList" :value="role.roleId" :key="role.roleId">{{ role.roleName}}</Option>
            </Select>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="updated()">更改</Button>
          <Button @click="cancelUpdate()">取消</Button>
        </div>
      </Modal>
    </div>
    <div>
      <Table :columns="columns" :data="data">
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="update(index)">更改</Button>
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
            width: 150,
            align: 'center'
          },
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '工号',
            key: 'username',
            width: 150
          },
          {
            title: '姓名',
            key: 'staffName',
            width: 150
          },
          {
            title: '性别',
            key: 'staffSex',
            width: 80
          },
          {
            title: '出生年月',
            key: 'staffBirth',
            width: 200,
            sortable: true,
            render: (h, params) => {
              return h('div', this.moment(params.row.staffBirth).format('YYYY-MM-DD HH:mm:ss'))
            }
          },
          {
            title: '婚况',
            key: 'staffMarried',
            width: 150
          },
          {
            title: '身份证号',
            key: 'idNumber',
            width: 250
          },
          {
            title: '联系电话',
            key: 'staffTel',
            width: 200
          },
          {
            title: '所属部门',
            key: 'deptName',
            width: 150
          },
          {
            title: '居住地址',
            key: 'staffAddr',
            width: 250
          },
          {
            title: '角色',
            key: 'roles',
            render(h, params) {
              var newArr = [];
              params.row.roles.forEach(element => {
                newArr.push(h('Tag', {
                  prop: {
                    color: "red"
                  },
                  style: {
                    margin: "5px"
                  }
                }, element.roleName))
              })
              return h("div", newArr)
            },
            width: 150
          },
          {
            title: '入职时间',
            key: 'entryTime',
            width: 200,
            sortable: true,
            render: (h, params) => {
              return h('div', this.moment(params.row.entryTime).format('YYYY-MM-DD HH:mm:ss'))
            }
          }
        ],
        data: [],
        modal: false,
        modal2: false,
        modal3: false,
        total: 0,
        deptList: [],
        nationList: [],
        roleList: [],
        conditionForm: {
          deptName: '',
          username: '',
          idNumber: '',
          staffName: ''
        },
        addForm: {
          username: '',
          staffName: '',
          staffBirth: '',
          staffSex: '',
          staffNation: '',
          staffTel: '',
          staffAddr: '',
          staffMarried: '',
          deptName: '',
          password: '',
          idNumber: '',
          role: ''
        },
        resetForm: {
          username: '',
          password: ''
        },
        updateForm: {
          username: '',
          staffName: '',
          staffBirth: '',
          staffSex: '',
          staffNation: '',
          staffTel: '',
          staffAddr: '',
          staffMarried: '',
          deptName: '',
          idNumber: '',
          role: ''
        },
        ruleValidate: {
          idNumber: [{
              required: true,
              message: '身份证不能为空',
              trigger: 'blur'
            },
            {
              type: 'string',
              pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
              message: '请输入正确的身份证号',
              trigger: 'change'
            }
          ],
          username: [{
            required: true,
            message: '姓名不能为空',
            trigger: 'change'
          }],
          staffName: [{
            required: true,
            message: '姓名不能为空',
            trigger: 'change'
          }],
          password: [{
            required: true,
            message: '初始密码不能为空',
            trigger: 'change'
          }],
          staffSex: [{
            required: true,
            message: '性别不能为空',
            trigger: 'change'
          }],
          staffNation: [{
            required: true,
            message: '民族不能为空',
            trigger: 'change'
          }],
          staffBirth: [{
            required: true,
            pattern: /.+/,
            message: '出生年月日不能为空',
            trigger: 'change'
          }],
          staffAddr: [{
            required: true,
            message: '户口地址不能为空',
            trigger: 'change'
          }, ],
          staffTel: [{
              required: true,
              message: '手机号不能为空',
              trigger: 'blur'
            },
            {
              type: 'string',
              pattern: /^[1][3-9][0-9]{9}$/,
              message: '请输入正确手机号',
              trigger: 'change'
            }
          ],
          deptName: [{
            required: true,
            message: '入院科室不能为空',
            trigger: 'change'
          }, ],
          role: [{
            required: true,
            message: '角色不能为空',
            trigger: 'blur',
            type:'array'
          }]
        },
        ruleValidate2: {
          username: [{
            required: true,
            message: '姓名不能为空',
            trigger: 'change'
          }],
          password: [{
            required: true,
            message: '密码不能为空',
            trigger: 'change'
          }]
        }
      }
    },
    created() {
      this.getDept()
      this.getStaff()
      this.getRole()
      this.getNation()
    },
    methods: {
      getDept() {
        this.$http({
            url: 'common/getDept',
            method: 'GET'
          })
          .then(res => {
            if (res.data.status === 200) {
              this.deptList = res.data.data
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err)
            this.$Message.info("服务器出错")
          })
      },
      getNation() {
        this.$http({
            url: 'common/getNationList',
            method: 'GET'
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.nationList = res.data.data
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
      getStaff() {
        this.$http({
            url: 'staff/getStaff',
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
            url: 'staff/getStaff',
            method: 'GET',
            params: {
              deptName: this.conditionForm.deptName,
              username: this.conditionForm.username,
              idNumber: this.conditionForm.idNumber,
              staffName: this.conditionForm.staffName,
              pageNum: pageNum
            }
          })
          .then(res => {
            if (res.data.status === 200) {
              this.datas = res.data.data.list
              this.total = res.data.data.total
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err);
          })
      },
      update(index) {
        this.$http({
            url: 'staff/getStaffByUsername',
            method: 'GET',
            params: {
              username: this.data[index].username
            }
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.modal2 = true
              this.updateForm = res.data.data
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          }).catch((err) => {
            console.log(err);
          });
      },
      updated() {
        this.$refs.updateForm.validate(valid => {
          if (valid) {
            this.$http({
                url: 'staff/updateStaff',
                method: 'POST',
                data: this.updateForm
              })
              .then((res) => {
                if (res.data.status === 200) {
                  this.modal2 = false
                  this.$Message.info(res.data.data)
                  this.getStaff();
                } else if (res.data.status === 500) {
                  this.$Message.info(res.data.msg)
                }
              }).catch((err) => {
                console.log(err);
              });
          }
        })

      },
      cancelUpdate() {
        this.modal2 = false;
      },
      cancelAdd() {
        this.modal = false;
        this.$refs.addForm.resetFields();
      },
      add() {
        this.$http({
            url: 'staff/addStaff',
            method: 'POST',
            data: this.addForm
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.modal = false
              this.$refs.addForm.resetFields();
              this.$Message.info(res.data.data)
              this.getStaff()
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          }).catch((err) => {
            console.log(err);
          });
      },
      showAddPanel() {
        this.modal = true;
      },
      resetCancel() {
        this.$refs.reset.resetFields();
        this.modal3 = false;
      },
      reset() {
        this.$refs.reset.validate(valid => {
          if (valid) {}
          this.$http({
              url: 'staff/resetPW',
              method: 'POST',
              data: this.resetForm
            })
            .then((res) => {
              if (res.data.status === 200) {
                this.$Message.info(res.data.data)
                this.$refs.reset.resetFields()
                this.modal3 = false;
              } else if (res.data.status === 500) {
                this.$Message.info(res.data.msg)
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
      }
    }
  }

</script>
