<template>
  <div id="medicalAdviceQuery">
    <!-- 条件查询区域 -->
    <PatientSelectCard></PatientSelectCard>
    <!-- 表格区域 -->
    <Table height="600px" border :columns="columns1" :data="data1">
      <template slot-scope="{ row, index }" slot="action">
        <router-link :to="{ name: 'MedicalAdviceDetail'}"><Button type="primary" size="small"
            style="margin-right: 5px">查看医嘱</Button></router-link>
        <router-link :to="{ name: 'MedicalAdviceDetail'}"><Button type="error" size="small"
            style="margin-right: 5px">更改医嘱</Button></router-link>
      </template>
    </Table>
    <!-- 分页区域 -->
    <Page :total="100" show-elevator />
  </div>
</template>

<script>
  import PatientSelectCard from '@/components/select-card/PatientSelectCard'
  export default {
    data() {
      return {
        columns1: [{
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '操作',
            slot: 'action',
            width: 200,
            align: 'center'
          },
          {
            title: '医保号',
            key: 'iiMedicalInsuranceNumber',
            width: 150
          },
          {
            title: '住院号',
            key: 'ii_ad_number',
            width: 150
          },
          {
            title: '身份证号',
            key: 'pId',
            width: 200
          },
          {
            title: '姓名',
            key: 'pName',
            width: 150
          },
          {
            title: '性别',
            key: 'pSex',
            width: 80
          },
          {
            title: '年龄',
            key: 'pAge',
            width: 100,
            sortable: true
          },
          {
            title: '出生年月日',
            key: 'pBirth',
            width: 150,
            sortable: true
          },
          {
            title: '病房',
            key: 'iwardId',
            width: 100
          },
          {
            title: '病床',
            key: 'bId',
            width: 100
          },
          {
            title: '入院日期',
            key: 'iiDateAdmission',
            width: 200
          },
          {
            title: '诊断1',
            key: 'iiDiagnosis01',
            width: 300
          },
          {
            title: '诊断2',
            key: 'iiDiagnosis02',
            width: 300
          },
          {
            title: '入住科室',
            key: 'deptId',
            width: 150
          },
          {
            title: '收治医生',
            key: 'iiAdmittedDoc',
            width: 150
          },
          {
            title: '主治医生',
            key: 'iiAttendingDoc',
            width: 150
          },
          {
            title: '主诊医生',
            key: 'iiVisitingDoc',
            width: 150
          }
        ],
        data1: [{
          iiMedicalInsuranceNumber: '41544',
          pId: '554541152',
          ii_ad_number: '892245',
          pName: '张三',
          pSex: '男',
          pAge: '58',
          pBirth: '1989-00-00',
          iiDiagnosis01: '没救了',
          iiDiagnosis02: '除非有钱',
          deptId: '心管科',
          iiAdmittedDoc: '李四',
          iiAttendingDoc: '王五',
          iiVisitingDoc: '赵六',
          iwardId: 'Q512',
          bId: '9',
          iiDateAdmission: '1563-02-01'
        }]
      }
    },

    components: {
      PatientSelectCard
    },

    computed: {},

    methods: {}
  }

</script>
<style scoped>
</style>
