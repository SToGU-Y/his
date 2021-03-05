<style scoped>
  .page-box {
    margin-top: 10px;
  }
  .table-box{
    margin-top: 10px;
  }

</style>
<template>
  <div id="depositReturn">
    <!-- 搜索条件组件 -->
    <div style="background:#eee;padding:20px">
      <Card :bordered="false">
        <div id="cardItem">
          <Select filterable clearable v-model="conditionForm.deptNameSelective" style="width:200px">
            <Option v-for="item in deptList" :value="item.deptName" :key="item.deptName">{{ item.deptName }}</Option>
          </Select>
          <Input v-model="conditionForm.admissionNumber" placeholder="请输入住院号" clearable style="width: 200px; margin-right:5px" />
          <Input v-model="conditionForm.pid"  placeholder="请输入身份证号" clearable style="width: 200px;margin-right:5px" />
          <Input v-model="conditionForm.pname"  placeholder="请输入病人姓名" clearable style="width: 200px;margin-right:5px" />
          <DatePicker type="daterange" placement="bottom-end" placeholder="请选择付款时间"
            style="width: 200px;margin-right:5px"
            format="yyyy-MM-dd" @on-change="setTime"></DatePicker>
          <Button class="search-btn" type="primary" shape="circle" icon="ios-search" @click="getInpatientInformation()"></Button>
        </div>
      </Card>
    </div>
    <!-- 查询结果表格之类的 -->
    <div class="table-box">
      <Table border :columns="columns" :data="data">
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" @click="update(index)">退款</Button>
        </template>
      </Table>
      <Modal :mask-closable="false" :closable="false" v-model="modal" title="提示">
        此操作将无法恢复！您确定要退押金吗？
        <div slot="footer">
          <Button type="primary" @click="updateDeposit()">退款</Button>
          <Button @click="cancelUpdate()">取消</Button>
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
            slot: 'action',
            width: 120
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
        conditionForm:{
          deptNameSelective: '',
          pid: '',
          pname: '',
          admissionNumber: '',
          payDateStart: '',
          payDateEnd: '',
        },
        depositForm: {
          desId: '',
          operator: '',
          admissionId: ''
        },
        total: 0,
        sid: '',
      }
    },

    components: {
      PatientSelectCard
    },

    created() {
      this.getDept();
      this.getInpatientInformation();
      this.sid = JSON.parse(localStorage.getItem("TOKEN")).username;
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
            }else if (res.data.status === 500) {
            this.$Message.info(res.data.msg)
            } 
          })
          .catch(err => {
            console.log(err)
            this.$Message.info("服务器出错")
          })
      },
      getInpatientInformation() {
        this.$http({
            url: 'register/getInformationWithDeposit2',
            method: 'GET',
            params: this.conditionForm
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
            url: 'register/getInformationWithDeposit2',
            method: 'GET',
            params: {
              deptName: this.conditionForm.deptNameSelective,
              pid: this.conditionForm.pid,
              pname: this.conditionForm.pname,
              payDateStart: this.conditionForm.payDateStart,
              payDateEnd: this.conditionForm.payDateEnd,
              pageNum: pageNum
            }
          })
          .then(res => {
            if (res.data.status === 200) {
              this.data = res.data.data.list
              this.total = res.data.data.total
              this.pageNum = pageNum
            } else if (res.data.status === 500) {
            this.$Message.info(res.data.msg)
            } 
          })
          .catch(err => {
            console.log(err)
          })
      },
      update(index) {
        this.depositForm.desId = this.data[index].desId
        this.depositForm.operator = this.sid;
        this.depositForm.admissionId = this.data[index].admissionId;
        this.modal = true;
      },
      updateDeposit() {
        this.$http({
            url: 'deposit/depositReturn',
            method: 'POST',
            data: this.depositForm
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.$Message.info(res.data.data)
              this.modal = false
              this.depositForm = {
                desId: '',
                operator: '',
                admissionId: ''
              }
              this.getInpatientInformation();
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
              this.modal = false
              this.depositForm = {
                desId: '',
                operator: '',
                admissionId: ''
              }
              this.getInpatientInformation()
            }else if (res.data.status === 500) {
            this.$Message.info(res.data.msg)
            } 
          })
          .catch((err) => {
            console.log(err);
          });
      },
      cancelUpdate() {
        this.depositForm = {
          desId: '',
          operator: '',
          admissionId: ''
        }
        this.modal = false
      },
      setTime(date){
        this.conditionForm.payDateStart = date[0];
        this.conditionForm.payDateEnd = date[1]
      }
    }
  }

</script>
