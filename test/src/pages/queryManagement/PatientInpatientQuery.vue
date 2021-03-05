<template>
  <div id="patientInpatientQuery">
    <!-- 查询组件 -->
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
            title: '户口地址',
            key: 'regAddr',
            width: 200
          },
          {
            title: '联系电话',
            key: 'tel',
            width: 150
          },
          {
              title:'住院状态',
              key:'status',
              width: 100,
              render:(h,params) =>{
                  if (params.row.status === 0) {
                      return h('div','在院')
                  }else if (params.row.status === 1) {
                      return h('div','可出院')
                  }else if (params.row.status === 2) {
                      return h('div','出院')
                  }     
              },
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
              return h('div',params.row.dateOfDischarge === null ? '' : this.moment(params.row.dateOfDischarge).format('YYYY-MM-DD HH:mm:ss'))
            }
          },
          {
            title: '住院天数',
            key: 'day',
            width: 150
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
            url: 'query/queryInpatient',
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
            url: 'query/queryInpatient',
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
<style scoped>

  .page-box {
    margin-top: 10px;
  }

</style>
