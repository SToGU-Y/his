<style scoped>
  .page-box {
    margin-top: 10px;
  }

</style>
<template>
  <div id="patientDepositQuery">
    <!-- 搜索条件组件 -->
    <div class="card-box" style="background:#eee;padding:20px">
      <Card :bordered="false">
        <div id="cardItem">
          <Input placeholder="请输入住院号" v-model="conditionForm.admissionNumber" clearable style="width: 200px;" />
          <Input placeholder="身份证号" v-model="conditionForm.pid" clearable style="width: 200px;" />
          <Button class="search-btn" type="primary" shape="circle" icon="ios-search" @click="getInpatientInformation()"></Button>
        </div>
      </Card>
    </div>
    <!-- 查询结果表格之类的 -->
    <div class="table-box">
      <Table height="540px" border :columns="columns" :data="data">
      </Table>
    </div>
    <!-- 分页 -->
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
        total: 0,
        conditionForm:{
            admissionNumber:'',
            pid:''
        }
      }
    },

    methods: {
      getInpatientInformation() {
        this.$http({
            url: 'query/queryDeposit',
            method: 'GET',
            params:this.conditionForm
          })
          .then(res => {
            if (res.data.status === 200) {
              this.data = res.data.data.list
              this.total = res.data.data.total
            }else if (res.data.status) {
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
            url: 'query/queryDeposit',
            method: 'GET',
            params: {
              admissionNumber: this.conditionForm.admissionNumber,
              pid: this.conditionForm.pid,
              pageNum: pageNum
            }
          })
          .then(res => {
            if (res.data.status === 200) {
              this.data = res.data.data.list
            } else if (res.data.status === 500) {
              this.$Message.info("请输入正确的搜索条件")
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  }

</script>
