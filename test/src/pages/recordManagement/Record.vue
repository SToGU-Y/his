<template>
  <div id="record">
    <!-- 条件筛选模块 -->
    <PatientSelectCard
    :deptList="deptList"
    @search="search">
    </PatientSelectCard>
    <!-- 表格区域 -->
    <div id="table-box">
    <Table border :columns="columns" :data="data">
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" @click="getRecord(index)">病历查看</Button>
      </template>
    </Table>
    </div>
    <Modal width="800px" :mask-closable="false" :closable="false" v-model="modal">
      <div id="printMe">  
        <div id="information">
          <h2 align="center">住院病历</h2>
          <Row>
            <Col span="5">
            姓名:{{patient.name}}
            </Col>
            <Col span="5">
            性别:{{patient.sex}}
            </Col>
            <Col span="6">
            年龄:{{patient.age}}
            </Col>
            <Col span="5">
              病人性质:{{patient.ptName}}
            </Col>
          </Row>
          <Row>
            <Col span="5">
            入院科室:{{patient.deptName}}
            </Col>
            <Col span="5">
            病房:{{patient.wardId}}
            </Col>
            <Col span="6">
            床位:{{patient.bid}}
            </Col>
            <Col span="8">
            住院号:{{patient.admissionNumber}}
            </Col>
          </Row>
          <Row>
            <Col span="7">
              入院日期:{{patient.dateOfAdmission}}
            </Col>
            <Col span="9">
              记录日期:{{record.createTime}}
            </Col>
            <Col span="6">
              医生:{{record.operator}}
            </Col>
          </Row>
        </div>
        <Divider />
        <div id="recordForm">
          <Form ref="add" :model="record" label-colon=":" label-position="right" :label-width="100">
            <FormItem label="主诉" prop="complaint">
              {{record.complaint}}
            </FormItem>
            <FormItem label="症状" prop="symptom">
              {{record.symptom}}
            </FormItem>
            <FormItem label="现病史" prop="historyOfPresentIllness">
              {{record.historyOfPresentIllness}}
            </FormItem>
            <FormItem label="既往病史" prop="anamnesis">
              {{record.anamnesis}}
            </FormItem>
            <FormItem label="药物过敏历史" prop="drugAllergy">
              {{record.drugAllergy}}
            </FormItem>
          </Form>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" v-print="printObj">打印</Button>
        <Button @click="close">关闭</Button>
      </div>
    </Modal>

    <!-- 分页区域 -->
    <div id="page-box">
      <Page :total="total" show-elevator @on-change="pageChange"/>
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
            width: 100,
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
            render: (h, params) => {
              return h('div', this.moment(params.row.dateOfAdmission).format('YYYY-MM-DD HH:mm:ss'))
            }
          },
          {
            title: '诊断1',
            key: 'diagnosis01',
            width: 300,
            render:(h, params) => {
              return h('div', [
                h('span', {
                  style: {display: 'inline-block', 
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'},
                  domProps: {title: params.row.diagnosis01},
                  on:{click:(e) => { e.stopPropagation();}}
                }, params.row.diagnosis01)
              ]);
          }
          },
          {
            title: '诊断2',
            key: 'diagnosis02',
            width: 300,
            render:(h, params) => {
              return h('div', [
                h('span', {
                  style: {display: 'inline-block', 
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'},
                  domProps: {title: params.row.diagnosis02},
                  on:{click:(e) => { e.stopPropagation();}}
                }, params.row.diagnosis02)
              ]);
          }
          },
          {
            title: '入住科室',
            key: 'deptName',
            width: 150
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
          }
        ],
        data: [],
        modal: false,
        total: 0,
        deptList: [],
        record: {
          drugAllergy: '',
          complaint: '',
          symptom: '',
          historyOfPresentIllness: '',
          anamnesis: '',
          operator:''
        },
        patient: {
          name: '',
          sex: '',
          age: '',
          ptName:'',
          deptName: '',
          wardId: '',
          bid: '',
          admissionNumber: '',
          dateOfAdmission: ''
        },
        conditionForm: {
          deptName: '',
          pid: '',
          pname: '',
          admissionId: '',
          admissionOfDateStart: '',
          admissionOfDateEnd: ''
        },
        printObj:{
          id:'printMe',
          popTitle: '病历',
          extraHead: '<meta http-equiv="Content-Language" content="zh-ch"/>'
        }
      }
    },

    components: {
      PatientSelectCard
    },

    created() {
      this.getInpatientInformation()
      this.getDept()
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
            }
          })
          .catch(err => {
            console.log(err)
            this.$Message.info("服务器出错")
          })
      },
      search(deptNameSelective, pid, pname, admissionNumber, admissionOfDate) {
        this.conditionForm = {
          deptName: deptNameSelective,
          pid: pid,
          pname: pname,
          admissionNumber: admissionNumber,
          admissionOfDateStart: admissionOfDate[0],
          admissionOfDateEnd: admissionOfDate[1]
        }
        this.$http({
            url: 'record/getInformationByCondition2',
            method: 'GET',
            params: {
              deptName: deptNameSelective,
              pid: pid,
              pname: pname,
              admissionNumber: admissionNumber,
              admissionOfDateStart: admissionOfDate[0],
              admissionOfDateEnd: admissionOfDate[1]
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
            url: 'record/getInformationByCondition2',
            method: 'GET',
            params: this.conditionForm
          })
          .then(res => {
            if (res.data.status === 200) {
              this.data = res.data.data.list
              this.total = res.data.data.total
            }
          })
          .catch(err => {
            this.$Message.info("操作错误")
            console.log(err)
          })
      },
      pageChange(pageNum) {
        this.$http({
            url: 'record/getInformationByCondition2',
            method: 'GET',
            params: {
              deptName: this.conditionForm.deptName,
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
      getRecord(index) {
        this.$http({
          url:'record/getRecordByAdmissionId',
          method:'GET',
          params:{
            admissionId:this.data[index].id
          }
        })
        .then((res) => {
          if (res.data.status === 200) {
            this.patient.name = this.data[index].pname
            this.patient.sex = this.data[index].sex
            this.patient.age = this.data[index].age
            this.patient.deptName = this.data[index].deptName
            this.patient.wardId = this.data[index].iwardId
            this.patient.bid = this.data[index].bid
            this.patient.ptName = this.data[index].ptName
            this.patient.admissionNumber = this.data[index].admissionNumber
            this.record.admissionId = this.data[index].id
            this.patient.dateOfAdmission = this.moment(this.data[index].dateOfAdmission).format('YYYY-MM-DD')
            this.record = res.data.data
            this.record.createTime = this.moment(this.record.createTime).format('YYYY-MM-DD')
            this.modal = true
          }
        })
        .catch((err) => {
          console.log(err);
        });
      },
      close(){
        this.modal = false;
      }
    }
  }

</script>
<style scoped>
  #information{
    font-weight: 700;
    padding-left: 30px;
  }
  #page-box{
    margin-top: 10px;
  }
  #table-box{
    margin-top: 10px;
  }
  #printMe{
    word-wrap: break-word;
    word-break: break-all;
  }
</style>
