<style scoped>

  .table-box{
    margin-top: 10px;
  }
  
  .page-box {
    margin-top: 10px;
  }

</style>
<template>
  <div id="depositQuery">
    <!-- 搜索条件组件 -->
    <PatientSelectCard :deptList="deptList" @search="search"></PatientSelectCard>
    <!-- 查询结果表格之类的 -->
    <div class="table-box">
      <Table border :columns="columns" :data="data">
      </Table>
      <Modal :mask-closable="false" :closable="false" v-model="modal" title="提示">
        <strong>请确认收到付款再确认</strong>
        <Form ref="pay" label-colon=":" :rules="ruleValidate" :model="payForm" label-position="right"
          :label-width="100">
          <FormItem label="付款方式" prop="paymentType">
            <Select v-model="payForm.paymentType">
              <Option v-for="payment in paymentList" :key="payment.paymentType" :value="payment.paymentType">
                {{payment.paymentType}}</Option>
            </Select>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="update()">补交</Button>
          <Button @click="cancel()">取消</Button>
        </div>
      </Modal>
    </div>
    <!-- 分页 -->
    <div class="page-box">
      <Page :total="total" show-elevator @on-change="pageChange" />
    </div>

  </div>
</template>

<script>
  import PatientSelectCard from '@/components/select-card/PatientSelectCard'
  export default {
    data() {
      return {
        columns: [{
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '操作',
            render: (h, params) => {
              return h("Button", {
                domProps: {
                  innerText: '补交'
                },
                props: {
                  type: 'primary',
                  disabled: params.row.depositStatus == 0 ? false : true
                },
                on: {
                  click: () => {
                    this.check(params)
                  }
                }
              })
            },
            align: 'center',
            width: 100
          },
          {
            title: '医保号',
            key: 'medicalNumber',
            width: 150
          },
          {
            title: '住院号',
            key: 'admissionNumber',
            width: 150
          },
          {
            title: '身份证号',
            key: 'pid',
            width: 200
          },
          {
            title: '押金单号',
            key: 'desId',
            width: 200
          },
          {
            title: '姓名',
            key: 'pname',
            width: 150
          },
          {
            title: '押金金额',
            key: 'deposit',
            width: 100
          },
          {
            title: '押金状态',
            key: 'depositStatus',
            width: 100,
            render: (h, params) => {
              return h('div', [
                h('Badge', {
                  attrs: {
                    status: params.row.depositStatus == '1' ? 'success' : 'error'
                  }
                }),
                h('span', {
                  style: {
                    color: params.row.depositStatus == '1' ? '#19be6b' : 'red'
                  }
                }, params.row.depositStatus == '1' ? '已交' : '未交')
              ])
            }
          },
          {
            title: '付款方式',
            key: 'paymentType',
            width: 100
          },
          {
            title: '付款时间',
            key: 'datePay',
            width: 200,
            sortable: true,
            render: (h, params) => {
              return h('div', params.row.datePay == null ? '' : this.moment(params.row.datePay).format(
                'YYYY-MM-DD HH:mm:ss'))
            }
          },
          {
            title: '操作者',
            key: 'operator',
            width: 100
          },
          {
            title: '性别',
            key: 'sex',
            width: 80
          },
          {
            title: '病人性质',
            key: 'ptName',
            width: 150
          },
          {
            title: '入住科室',
            key: 'deptName',
            width: 150
          },
          {
            title: '病房',
            key: 'iwardId',
            width: 100
          },
          {
            title: '病床',
            key: 'bid',
            width: 100
          },
          {
            title: '入院日期',
            key: 'dateOfAdmission',
            width: 200,
            sortable: true,
            render: (h, params) => {
              return h('div', this.moment(params.row.dateOfAdmission).format('YYYY-MM-DD HH:mm:ss'))
            }
          }
        ],
        data: [],
        modal: false,
        deptList: [],
        deptNameSelective: '',
        pid: '',
        pname: '',
        admissionNumber: '',
        admissionOfDateStart: '',
        admissionOfDateEnd: '',
        total: 0,
        sid: '',
        payForm: {
          desId: '',
          paymentType: ''
        },
        ruleValidate: {
          paymentType: [{
            required: true,
            type: 'string',
            message: '不能为空',
            trigger: 'blur'
          }]
        },
        paymentList:[]
      }
    },

    components: {
      PatientSelectCard
    },

    created() {
      this.getDept();
      this.getPayment();
      this.getInpatientInformation();
      this.sid = JSON.parse(localStorage.getItem("TOKEN")).username;
    },

    methods: {
      getPayment() {
        this.$http({
            url: 'common/getPayment',
            method: 'GET'
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.paymentList = res.data.data
            }else if (res.data.status === 500) {
            this.$Message.info(res.data.msg)
            } 
          })
          .catch((err) => {
            console.log(err);
          });
      },
      getDept() {
        this.$http({
            url: 'common/getDept',
            method: 'GET'
          })
          .then(res => {
            if (res.data.status === 200) {
              this.deptList = res.data.data
            }else if (res.data.status === 500) {
            this.$Message.info(res.data.msg)
            } 
          })
          .catch(err => {
            console.log(err)
            this.$Message.info("服务器出错")
          })
      },
      search(deptNameSelective, pid, pname, admissionNumber, admissionOfDate) {
        this.deptNameSelective = deptNameSelective
        this.pid = pid
        this.pname = pname
        this.admissionNumber = admissionNumber
        this.admissionOfDateStart = admissionOfDate[0]
        this.admissionOfDateEnd = admissionOfDate[1]
        this.$http({
            url: 'register/getInformationWithDeposit3',
            method: 'GET',
            params: {
              deptName: this.deptNameSelective,
              pid: this.pid,
              pname: this.pname,
              admissionNumber: this.admissionNumber,
              admissionOfDateStart: this.admissionOfDateStart,
              admissionOfDateEnd: this.admissionOfDateEnd
            }
          })
          .then(res => {
            if (res.data.status === 200) {
              this.data = res.data.data.list
              this.total = res.data.data.total
            } else if (res.data.status === 500) {
            this.$Message.info(res.data.msg)
            } 
          })
          .catch(err => {
            this.$Message.info("操作错误")
            console.log(err)
          })

      },
      getInpatientInformation() {
        this.$http({
            url: 'register/getInformationWithDeposit3',
            method: 'GET',
            params: {
              deptName: this.deptNameSelective,
              pid: this.pid,
              pname: this.pname,
              admissionNumber: this.admissionNumber,
              admissionOfDateStart: this.admissionOfDateStart,
              admissionOfDateEnd: this.admissionOfDateEnd
            }
          })
          .then(res => {
            if (res.data.status === 200) {
              this.data = res.data.data.list
              this.total = res.data.data.total
            }else if (res.data.status === 500) {
            this.$Message.info(res.data.msg)
            } 
          })
          .catch(err => {
            this.$Message.info("操作错误")
            console.log(err)
          })
      },
      pageChange(pageNum) {
        this.$http({
            url: 'register/getInformationWithDeposit3',
            method: 'GET',
            params: {
              deptName: this.deptNameSelective,
              pid: this.pid,
              pname: this.pname,
              admissionNumber: this.admissionNumber,
              admissionOfDateStart: this.admissionOfDateStart,
              admissionOfDateEnd: this.admissionOfDateEnd,
              pageNum: pageNum
            }
          })
          .then(res => {
            if (res.data.status === 200) {
              this.data = res.data.data.list
              this.total = res.data.data.total
              this.pageNum = pageNum
            } else if (res.data.status === 500) {
              this.$Message.info("请输入正确的搜索条件")
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      check(params) {
        this.payForm.desId = params.row.desId
        this.modal = true;
      },
      update() {
        this.$refs.pay.validate(valid => {
          if (valid) {
            this.$http({
                url: 'deposit/payDeposit',
                method: 'POST',
                data: {
                  desId: this.payForm.desId,
                  paymentType: this.payForm.paymentType,
                  sid: this.sid
                }
              })
              .then((res) => {
                if (res.data.status === 200) {
                  this.$Message.info(res.data.data)
                  this.modal = false;
                  this.$refs.pay.resetFields();
                  this.getInpatientInformation();
                } else if (res.data.status === 500) {
                  this.$Message.info(res.data.msg)
                  this.$refs.pay.resetFields();
                  this.modal = false;
                }
              })
              .catch((err) => {
                this.$Message.info("出错啦，请先不要继续操作")
                console.log(err);
              });

          } else {
            this.$Message.info("请选择付款方式")
          }
        })

      },
      cancel() {
        this.modal = false;
        this.payForm = {
          desId: '',
          paymentType: ''
        }
      }
    }
  }

</script>
