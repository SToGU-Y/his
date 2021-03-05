<template>
  <div id="leave">
    <!-- 搜索条件组件 -->
    <PatientSelectCard :deptList="deptList" @search="search"></PatientSelectCard>
    <div id="btn-box">
      <Button type="primary" @click="modal = true">出院</Button>

      <Modal :mask-closable="false" :closable="false" v-model="modal" title="出院">
        <Form label-colon=":" label-position="right" :label-width="100">
          <FormItem label="住院号" prop="admissionNumber">
            <Input v-model="admissionNumber" />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="check()">出院结算</Button>
          <Button @click="cancel()">取消出院</Button>
        </div>
      </Modal>

      <Modal :mask-closable="false" :closable="false" v-model="modal2" title="出院结算">
        <Form ref="leave" label-colon=":" :rules="ruleValidate" :model="leaveForm" label-position="right"
          :label-width="100">
          <FormItem label="住院号" prop="admissionNumber">
            <Input disabled v-model="admissionNumber" />
          </FormItem>
          <FormItem label="姓名" prop="admissionNumber">
            <Input disabled v-model="leaveForm.name" />
          </FormItem>
          <FormItem label="病人性质" prop="ptName">
            <Input disabled v-model="ptName" />
          </FormItem>
          <FormItem label="余额" prop="deposit">
            <Input disabled v-model="leaveForm.deposit" />
          </FormItem>
          <FormItem label="总花费" prop="costSum">
            <Input disabled v-model="leaveForm.costSum" />
          </FormItem>
          <FormItem label="应付" prop="pay">
            <Input disabled v-model="leaveForm.pay" />
          </FormItem>
          <FormItem label="结算方式" prop="paymentType">
            <Select v-model="leaveForm.paymentType">
              <Option v-for="payment in paymentList" :value="payment.paymentType" :key="payment.paymentType">
                {{payment.paymentType}}</Option>
            </Select>
          </FormItem>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="leave()">确定</Button>
          <Button @click="cancelLeave()">取消</Button>
        </div>
      </Modal>

    </div>
    <!-- 查询结果表格之类的 -->
    <div class="table-box">
      <Table border :columns="columns" :data="data">
      </Table>
    </div>
    <!-- 分页 -->
    <div class="page-box">
      <Page :total="total" show-elevator @on-change="pageChange" />
    </div>
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
            title: '年龄',
            key: 'age',
            width: 100,
            sortable: true
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
            title: '收治医生',
            key: 'admittedDoc',
            width: 150
          },
          {
            title: '主治医生',
            key: 'attendingDoc',
            width: 150
          },
          {
            title: '主诊医生',
            key: 'visitingDoc',
            width: 150
          },
          {
            title: '诊断1',
            key: 'diagnosis01',
            width: 300
          },
          {
            title: '诊断2',
            key: 'diagnosis02',
            width: 300
          },
          {
            title: '入院日期',
            key: 'dateOfAdmission',
            width: 200,
            sortable: true,
            render: (h, params) => {
              return h('div', this.moment(params.row.dateOfAdmission).format('YYYY-MM-DD HH:mm:ss'))
            }
          },
          {
            title: '出院日期',
            key: 'dateOfDischarge',
            width: 200,
            sortable: true,
            render: (h, params) => {
              return h('div', this.moment(params.row.dateOfDischarge).format('YYYY-MM-DD HH:mm:ss'))
            }
          },
          {
            title: '户口地址',
            key: 'regAddr',
            width: 200
          },
          {
            title: '联系电话',
            key: 'tel',
            width: 150
          }
        ],
        data: [],
        modal: false,
        modal2: false,
        deptList: [],
        paymentList: [],
        conditionForm: {
          deptNameSelective: '',
          pid: '',
          pname: '',
          admissionNumber: '',
          admissionOfDateStart: '',
          admissionOfDateEnd: '',
        },
        total: 0,
        admissionNumber: '',
        ptName: '',
        leaveForm: {
          admissionId: '',
          operator: '',
          deposit: '',
          costSum: '',
          pay: '',
          paymentType: ''
        },
        ruleValidate: {
          paymentType: [{
            required: true,
            type: 'string',
            message: '不能为空',
            trigger: 'change'
          }]
        }
      }
    },
    components: {
      PatientSelectCard
    },
    created() {
      this.getPayment()
      this.getDept();
      this.getInpatientInformation();
      this.leaveForm.operator = JSON.parse(localStorage.getItem("TOKEN")).username;
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
            } else if (res.data.status === 500) {
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
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err)
            this.$Message.info("服务器出错")
          })

      },
      search(deptNameSelective, pid, pname, admissionNumber, admissionOfDate) {
        this.conditionForm.deptNameSelective = deptNameSelective
        this.conditionForm.pid = pid
        this.conditionForm.pname = pname
        this.conditionForm.admissionNumber = admissionNumber
        this.conditionForm.admissionOfDateStart = admissionOfDate[0]
        this.conditionForm.admissionOfDateEnd = admissionOfDate[1]
        this.$http({
            url: 'register/getInformationCanLeave',
            method: 'GET',
            params: {
              deptName: this.conditionForm.deptNameSelective,
              pid: this.conditionForm.pid,
              pname: this.conditionForm.pname,
              admissionNumber: this.conditionForm.admissionNumber,
              admissionOfDateStart: this.conditionForm.admissionOfDateStart,
              admissionOfDateEnd: this.conditionForm.admissionOfDateEnd
            }
          })
          .then(res => {
            if (res.data.status === 200) {
              this.data = res.data.data.list
              this.total = res.data.data.total
            } else if (res.data.status === 500) {
              this.$Message.info("操作错误")
            }
          })
          .catch(err => {
            this.$Message.info("操作错误")
            console.log(err)
          })

      },
      getInpatientInformation() {
        this.$http({
            url: 'register/getInformationCanLeave',
            method: 'GET',
            params: {
              deptName: this.conditionForm.deptNameSelective,
              pid: this.conditionForm.pid,
              pname: this.conditionForm.pname,
              admissionNumber:this.conditionForm.admissionNumber,
              admissionOfDateStart: this.conditionForm.admissionOfDateStart,
              admissionOfDateEnd: this.conditionForm.admissionOfDateEnd
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
      pageChange(pageNum) {
        this.$http({
            url: 'register/getInformationCanLeave',
            method: 'GET',
            params: {
              deptName: this.conditionForm.deptNameSelective,
              pid: this.conditionForm.pid,
              pname: this.conditionForm.pname,
              admissionNumber: this.conditionForm.admissionNumber,
              admissionOfDateStart: this.conditionForm.admissionOfDateStart,
              admissionOfDateEnd: this.conditionForm.admissionOfDateEnd,
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
      cancelLeave() {
        this.modal2 = false;
      },
      cancel() {
        this.modal = false;
      },
      leave() {
        this.$refs.leave.validate(valid => {
          if (valid) {
            this.$http({
                url: 'bill/addBill',
                method: 'POST',
                data: this.leaveForm
              })
              .then((res) => {
                if (res.data.status === 200) {
                  this.$Message.info(res.data.data)
                  this.modal = false;
                  this.modal2 = false;
                  this.getInpatientInformation()
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
      check() {
        this.$http({
            url: 'register/getByAdmissionNumber',
            method: 'GET',
            params: {
              admissionNumber: this.admissionNumber
            }
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.leaveForm.admissionId = res.data.data.admissionId;
              this.leaveForm.deposit = res.data.data.deposit;
              this.leaveForm.pay = res.data.data.pay;
              this.leaveForm.costSum = res.data.data.costSum;
              this.leaveForm.name = res.data.data.name;
              this.ptName = res.data.data.ptName
              this.modal2 = true;
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }

    }
  }

</script>
<style scoped>
  #btn-box {
    text-align: left;
    margin: 5px;
  }

  .page-box {
    margin-top: 10px;
  }

</style>
