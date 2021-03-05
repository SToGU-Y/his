<template>
  <div id="canLeave">
    <!-- 条件筛选模块 -->
    <PatientSelectCard :deptList="deptList" @search="search"></PatientSelectCard>
    <!-- 表格区域 -->
    <div id="table-box">
      <Table border :columns="columns" :data="data">
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" @click="addLeaveRecord(index)">
            出院小结
          </Button>
        </template>
      </Table>

      <Modal width="800px" :mask-closable="false" :closable="false" v-model="modal" title="出院小结">
        <Form ref="add" :model="addForm" :rules="ruleValidate" label-colon=":" label-position="right"
          :label-width="100">
          <div id="information">
            <Row>
              <Col span="8">
              姓名:{{patient.name}}
              </Col>
              <Col span="8">
              性别:{{patient.sex}}
              </Col>
              <Col span="8">
              年龄:{{patient.age}}
              </Col>
            </Row>
            <Row>
              <Col span="8">
              入院科室:{{patient.deptName}}
              </Col>
              <Col span="8">
              病房:{{patient.wardId}}
              </Col>
              <Col span="8">
              床位:{{patient.bid}}
              </Col>
            </Row>
            <Row>
              <Col span="8">
              住院号:{{patient.admissionNumber}}
              </Col>
              <Col span="7">
              入院日期:{{patient.dateOfAdmission}}
              </Col>
              <Col span="8">
              <FormItem label="出院日期" prop="leaveDate">
                <DatePicker v-model="addForm.leaveDate" type="date" placement="bottom-end" placeholder="请选择出院时间"
                  format="yyyy-MM-dd"></DatePicker>
              </FormItem>
              </Col>
            </Row>
          </div>
          <input type="hidden" v-model="addForm.admissionId" />
          <FormItem label="入院情况" prop="admission">
            <Input v-model="addForm.admission" :rows="6" type="textarea" style="width: 90%" />
          </FormItem>
          <FormItem label="入院诊断" prop="admissionDiagnosis">
            <Input v-model="addForm.admissionDiagnosis" :rows="6" type="textarea" style="width: 90%" />
          </FormItem>
          <FormItem label="诊疗过程" prop="diagnosisProcess">
            <Input type="textarea" :rows="6" style="width: 90%" v-model="addForm.diagnosisProcess" />
          </FormItem>
          <FormItem label="出院状况" prop="dischargeStatus">
            <Input type="textarea" :rows="6" style="width: 90%" v-model="addForm.dischargeStatus" />
          </FormItem>
          <FormItem label="出院诊断" prop="dischargeDiagnosis">
            <Input type="textarea" :rows="6" style="width: 90%" v-model="addForm.dischargeDiagnosis" />
          </FormItem>
          <FormItem label="出院医嘱" prop="dischargeAdvice">
            <Input type="textarea" :rows="6" style="width: 90%" v-model="addForm.dischargeAdvice" />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button @click="save()">保存</Button>
          <Button @click="cancel()">关闭</Button>
        </div>
      </Modal>

    </div>
    <!-- 分页区域 -->
    <div id="page-box">
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
            width: 120,
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
              return h('div', this.moment(params.row.birth).format('YYYY-MM-DD'))
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
          }
        ],
        data: [],
        modal: false,
        total: 0,
        deptList: [],
        addForm: {
          admissionId: '',
          admission: '',
          leaveDate: '',
          admissionDiagnosis: '',
          diagnosisProcess: '',
          dischargeStatus: '',
          dischargeDiagnosis: '',
          dischargeAdvice: '',
          doctor: ''
        },
        patient: {
          name: '',
          sex: '',
          age: '',
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
          admissionNumber: '',
          admissionOfDateStart: '',
          admissionOfDateEnd: ''
        },
        selectiveList: [],
        ruleValidate: {
          admission: [{
            required: true,
            message: '入院情况不能为空',
            trigger: 'blur'
          }],
          admissionDiagnosis: [{
            required: true,
            message: '入院诊断不能为空',
            trigger: 'blur'
          }],
          dischargeStatus: [{
            required: true,
            message: '出院状况不能为空',
            trigger: 'blur'
          }],
          diagnosisProcess: [{
            required: true,
            message: '诊疗过程不能为空',
            trigger: 'blur'
          }],
          dischargeDiagnosis: [{
            required: true,
            message: '出院诊断不能为空',
            trigger: 'blur'
          }],
          leaveDate: [{
            required: true,
            message: '出院日期不能为空',
            type: 'date',
            trigger: 'blur'
          }],
        }
      }
    },

    components: {
      PatientSelectCard
    },

    created() {
      this.addForm.doctor = JSON.parse(localStorage.getItem("TOKEN")).username;
      this.getDept()
      this.getInpatientInformation()
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
      getInpatientInformation() {
        this.$http({
            url: 'advice/getInformationByCondition',
            method: 'GET',
            params: this.conditionForm
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
      search(deptIdSelective, pid, pname, admissionNumber, admissionOfDate) {
        this.conditionForm = {
          deptName: deptIdSelective,
          pid: pid,
          pname: pname,
          admissionNumber: admissionNumber,
          admissionOfDateStart: admissionOfDate[0],
          admissionOfDateEnd: admissionOfDate[1]
        }
        this.$http({
            url: 'advice/getInformationByCondition',
            method: 'GET',
            params: this.conditionForm
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
      pageChange(pageNum) {
        this.$http({
            url: 'advice/getInformationByCondition',
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
            } else if (res.data.status === 500) {
              this.$Message.info("请输入正确的搜索条件")
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      cancel() {
        this.$refs.add.resetFields();
        this.modal = false;
      },
      addLeaveRecord(index) {
        this.patient.name = this.data[index].pname;
        this.patient.sex = this.data[index].sex;
        this.addForm.admissionId = this.data[index].id;
        this.patient.age = this.data[index].age;
        this.patient.deptName = this.data[index].deptName;
        this.patient.wardId = this.data[index].iwardId;
        this.patient.bid = this.data[index].bid;
        this.patient.admissionNumber = this.data[index].admissionNumber;
        this.patient.dateOfAdmission = this.moment(this.data[index].dateOfAdmission).format('YYYY-MM-DD');
        this.modal = true;
      },
      save() {
        this.$refs.add.validate(valid => {
          if (valid) {
            this.$http({
                url: 'leaveRecord/save',
                method: 'POST',
                data: this.addForm
              })
              .then((res) => {
                if (res.data.status === 200) {
                  this.$Message.info(res.data.data)
                  this.$refs.add.resetFields();
                  this.getInpatientInformation();
                  this.modal = false;
                } else if (res.data.status === 500) {
                  this.$Message.info(res.data.msg)
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })

      }
    }
  }

</script>
<style scoped>
  #table-box {
    margin-top: 10px;
  }

  #page-box {
    margin-top: 10px;
  }

</style>
