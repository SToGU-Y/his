<template>
  <div id="patientMedicalRecordQuery">
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
    <!-- 表格区域 -->
    <div id="table-box">
    <Table height="600px" border :columns="columns" :data="data">
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
      <Page :total="total" show-elevator />
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
            width: 300
          },
          {
            title: '诊断2',
            key: 'diagnosis02',
            width: 300
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
        modal: false,
        total: 0,
        record: {
          drugAllergy: '',
          complaint: '',
          symptom: '',
          historyOfPresentIllness: '',
          anamnesis: ''
        },
        patient: {
          name: '',
          sex: '',
          age: '',
          deptName: '',
          wardId: '',
          bid: '',
          ptName:'',
          admissionNumber: '',
          dateOfAdmission: ''
        },
        conditionForm:{
            admissionNumber:'',
            pid:''
        },
         printObj:{
          id:'printMe',
          popTitle: '病历',
          extraHead: '<meta http-equiv="Content-Language" content="zh-ch"/>'
        }
      }
    },

    methods: {
      getInpatientInformation() {
        this.$http({
            url: 'query/queryRecord',
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
            url: 'query/queryRecord',
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
            this.patient.ptName = this.data[index].ptName
            this.patient.bid = this.data[index].bid
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
    margin-top: 7px;
  }
    #printMe{
    word-wrap: break-word;
    word-break: break-all;
  }
</style>
