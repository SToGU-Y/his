<style scoped>
  #cardItem .ivu-input-wrapper {
    margin: 0 20px 0 0;
  }

  .page-box {
    margin-top: 10px;
  }

  #btn-box {
    margin: 5px;
    text-align: left;
  }

</style>

<template>
  <div id="patientUpdate">
    <!-- 查询组件 -->
    <div class="card-box" style="background:#eee;padding:20px">
      <Card :bordered="false">
        <div id="cardItem">
          <Input placeholder="请输入身份证号" v-model="pid" autofocus clearable style="width: 200px;" />
          <Input placeholder="请输入姓名" v-model="pname" clearable style="width: 200px;" />
          <Button class="search-btn" type="primary" shape="circle" icon="ios-search" @click="getPatient"></Button>
        </div>
      </Card>
    </div>
    <div id="btn-box">
      <Button type="error" v-if="auth === 'ROLE_ADMIN'" @click="check">删除</Button>
      <Modal :mask-closable="false" :closable="false" v-model="modal2" title="提示">
        是否删除所选病患记录?
        <div slot="footer">
          <Button type="error" @click="del()">是</Button>
          <Button @click="no()">否</Button>
        </div>
      </Modal>
    </div>
    <Modal width="1200px" v-model="modal" title="信息更改" :mask-closable="false" :closable="false">
      <Form ref="update" :rules="ruleValidate" label-colon=":" :model="form" label-position="right" :label-width="100">
        <input v-model="form.oldpid" type="hidden" />
        <Row>
          <Col span="7">
          <FormItem label="身份证号" prop="pid">
            <Input v-model="form.pid" />
          </FormItem>
          </Col>
          <Col span="4">
          <FormItem label="姓名" prop="pname">
            <Input v-model="form.pname" />
          </FormItem>
          </Col>
          <Col span="4">
          <FormItem label="性别" prop="sex">
            <Select v-model="form.sex">
              <Option value="男">男</Option>
              <Option value="女">女</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="4">
          <FormItem label="民族" prop="nation">
            <Select filterable v-model="form.nation">
              <Option v-for="nation in nationList" :value="nation.nationName" :key="nation.no">{{ nation.nationName }}
              </Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="1">&#8195;</Col>
          <Col span="8">
          <FormItem label="出生年月日" prop="birth">
            <DatePicker v-model="form.birth"></DatePicker>
          </FormItem>
          </Col>
          <Col span="5">
          <FormItem label="国籍" prop="nationality">
            <Input v-model="form.nationality"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
          <FormItem label="籍贯" prop="city">
            <Row>
              <Col span="12">
              <Input v-model="form.province">
              <span slot="append">省</span>
              </Input>
              </Col>
              <Col span="12">
              <Input v-model="form.city">
              <span slot="append">市</span>
              </Input>
              </Col>
            </Row>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="出生地" prop="born">
            <Input v-model="form.born"></Input>
          </FormItem>
          </Col>
          <Col span="3">
          <FormItem label="婚姻" prop="married">
            <Input v-model="form.married"></Input>
          </FormItem>
          </Col>
          <Col span="6">
          <FormItem label="联系电话" prop="tel">
            <Input v-model="form.tel"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="10">
          <FormItem label="现居住地址" prop="currAddr">
            <Input v-model="form.currAddr" />
          </FormItem>
          </Col>
          <Col span="10">
          <FormItem label="户口地址" prop="regAddr">
            <Input v-model="form.regAddr"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="5">
          <FormItem label="紧急联系人" prop="contact">
            <Input v-model="form.contact"></Input>
          </FormItem>
          </Col>
          <Col span="4">
          <FormItem label="关系" prop="contact">
            <Input v-model="form.conRel"></Input>
          </FormItem>
          </Col>
          <Col span="8">
          <FormItem label="联系电话" prop="conTel">
            <Input v-model="form.conTel"></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="updated">更改</Button>
        <Button @click="cancelUpdate">取消</Button>
      </div>
    </Modal>
    <!-- 查询结果表格之类的 -->
    <Table @on-select-all-cancel="selectAllCancel" @on-select-all="selectAll"
      @on-select="advicesSelective" @on-select-cancel="cancelSelect" border :columns="columns" :data="patientlist">
    </Table>
    <!-- 分页模块 -->
    <div class="page-box">
      <Page :total="total" show-elevator @on-change="pageChange" />
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        columns: [{
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '操作',
            render: (h, params) => {
              return h("Button", {
                domProps: {
                  innerText: '更改'
                },
                props: {
                  type: 'primary'
                },
                on: {
                  click: () => {
                    this.update(params)
                  }
                }
              })
            },
            align: 'center',
            width: 100
          },
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '身份证号',
            key: 'pid',
            width: 200
          },
          {
            title: '姓名',
            key: 'pname',
            width: 150
          },
          {
            title: '性别',
            key: 'sex',
            width: 80
          },
          {
            title: '出生年月日',
            key: 'birth',
            width: 200,
            sortable: true,
            render: (h, params) => {
              return h('div', this.moment(params.row.birth).format('YYYY-MM-DD HH:mm:ss'))
            }
          },
          {
            title: '国籍',
            key: 'nationality',
            width: 150
          },
          {
            title: '民族',
            key: 'nation',
            width: 80
          },
          {
            title: '联系电话',
            key: 'tel',
            width: 150
          },
          {
            title: '婚况',
            key: 'married',
            width: 100
          },
          {
            title: '出生地',
            key: 'born',
            width: 150
          },
          {
            title: '户口地址',
            key: 'regAddr',
            width: 150
          },
          {
            title: '现居住地址',
            key: 'currAddr',
            width: 150
          },
          {
            title: '籍贯',
            key: 'nativePlace',
            width: 150
          },
          {
            title: '紧急联系人',
            key: 'contact',
            width: 150
          },
          {
            title: '紧急联系人关系',
            key: 'conRel',
            width: 150
          },
          {
            title: '紧急联系人电话',
            key: 'conTel',
            width: 150
          }
        ],
        patientlist: [],
        nationList: [],
        total : 0,
        pid: '',
        pname: '',
        modal: false,
        modal2: false,
        total: '',
        form: {
          oldpid: '',
          pid: '',
          pname: '',
          sex: '',
          nation: '',
          nationality: '',
          province: '',
          city: '',
          born: '',
          birth: '',
          married: '',
          tel: '',
          currAddr: '',
          regAddr: '',
          contact: '',
          conRel: '',
          conTel: '',
        },
        selectiveList: [],
        ruleValidate: {
          pid: [{
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
          pname: [{
            required: true,
            message: '姓名不能为空',
            trigger: 'change'
          }],
          age: [{
              required: true,
              message: '年龄不能为空',
              trigger: 'blur'
            },
            {
              pattern: /^\d+(\.\d+)?$/,
              message: '请输入数字',
              trigger: 'change'
            }
          ],
          sex: [{
            required: true,
            message: '性别不能为空',
            trigger: 'change'
          }],
          ptName: [{
            required: true,
            message: '类型不能为空',
            trigger: 'change'
          }],
          nation: [{
            required: true,
            message: '民族不能为空',
            trigger: 'change'
          }],
          nationality: [{
            required: true,
            message: '国籍不能为空',
            trigger: 'change'
          }],
          city: [{
            required: true,
            message: '籍贯不能为空',
            trigger: 'change'
          }],
          birth: [{
            required: true,
            pattern: /.+/,
            message: '出生年月日不能为空',
            trigger: 'change'
          }],
          currAddr: [{
            required: true,
            message: '现居住地址不能为空',
            trigger: 'change'
          }, ],
          regAddr: [{
            required: true,
            message: '户口地址不能为空',
            trigger: 'change'
          }, ],
          tel: [{
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
        },
        auth:''
      };
    },
    created() {
      this.auth = JSON.parse(localStorage.getItem("TOKEN")).auth[0].authority;
      this.getPatient();
      this.getNation();
    },
    methods: {
      getNation() {
        this.$http({
            url: 'common/getNationList',
            method: 'GET'
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.nationList = res.data.data
            }else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      getPatient() {
        this.$http({
            url: 'patient/getPatientByCondition',
            method: "GET",
            params: {
              pid: this.pid,
              pname: this.pname
            }
          })
          .then(res => {
            if (res.data.status == 200) {
              this.patientlist = res.data.data.list;
              this.total = res.data.data.total
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            this.$Message.error("服务器出错！")
          })
      },
      pageChange(pageNum) {
        this.$http({
            url: 'patient/getPatientByCondition',
            method: 'GET',
            params: {
              pid: this.pid,
              pname: this.pname,
              pageNum: pageNum
            }
          })
          .then(res => {
            if (res.data.status === 200) {
              this.datas = res.data.data.list
            }else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err);
          })
      },
      update(params) {
        this.$http({
            url: 'patient/getPatientByPid',
            method: 'GET',
            params: {
              pid: params.row.pid
            }
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.modal = true
              this.form = res.data.data
              this.$set(this.form, 'oldpid', this.form.pid)
            }else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      updated() {
        this.$refs.update.validate(valid => {
          if (valid) {
            this.$http({
                url: 'patient/updatePatient',
                method: 'POST',
                data: this.form
              })
              .then((res) => {
                if (res.data.status === 200) {
                  this.modal = false
                  this.$Message.info(res.data.data)
                  this.getPatient()
                } else if (res.data.status === 500) {
                  this.modal = false
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
        this.modal = false
        this.$refs.update.resetFields();
      },
      advicesSelective(selection, row) {
        this.selectiveList = selection
      },
      cancelSelect(selection, row) {
        this.selectiveList = selection
      },
      selectAllCancel() {
        this.selectiveList = []
      },
      selectAll(selection) {
        this.selectiveList = selection
      },
      check(){
        if (this.selectiveList.length === 0) {
          this.$Message.info("请先选择要操作的选项")
        }else{
          this.modal2 = true;
        }
      },
      del() {
          this.$http({
              url: 'patient/delPatient',
              method: 'POST',
              data: this.selectiveList
            })
            .then((res) => {
              if (res.data.status === 200) {
                this.$Message.info(res.data.dats)
                this.modal2 = false;
                this.getPatient()
              } else if (res.data.status === 500) {
                this.$Message.info(res.data.msg)
                this.modal2 = false;
              }
            })
            .catch((err) => {
              console.log(err);
            });
      },
      no() {
        this.modal2 = false;
      }

    }
  }

</script>
