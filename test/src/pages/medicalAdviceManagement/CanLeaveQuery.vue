<template>
  <div id="canLeaveQuery">
    <!-- 条件筛选模块 -->
    <div id="select-box">
      <div style="background:#eee;padding:20px">
        <Card :bordered="false">
            <div id="cardItem">
            <Input v-model="conditionForm.admissionNumber" placeholder="请输入住院号" clearable style="width: 200px; margin-right:5px" />
            <Input v-model="conditionForm.pid"  placeholder="请输入身份证号" clearable style="width: 200px;margin-right:5px" />
            <Input v-model="conditionForm.pname"  placeholder="请输入病人姓名" clearable style="width: 200px;margin-right:5px" />
            <DatePicker type="daterange" placement="bottom-end" placeholder="请选择出院时间"
                style="width: 200px;margin-right:5px"
                format="yyyy-MM-dd" @on-change="setTime"></DatePicker>
            <Select  style="width: 200px;margin-right:5px" v-model="conditionForm.status">
                <Option value="">全部</Option>
                <Option value="0">在院</Option>
                <Option value="1">待出院</Option>
                <Option value="2">出院</Option>
            </Select>
            <Button class="search-btn" type="primary" shape="circle" icon="ios-search" @click="getLeaveRecord()"></Button>
            </div>
        </Card>
      </div>
    </div>
    <div id="btn-box">
        <Button type="error" @click="delRecord">删除</Button>
    </div>
    <!-- 表格区域 -->
    <div id="table-box">
      <Table  @on-select-all-cancel="selectAllCancel" @on-select-all="selectAll" @on-select="advicesSelective" @on-select-cancel="cancelSelect" border :columns="columns" :data="data">
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" @click="edit(index)">
            更改
          </Button>
          <Button type="primary" size="small" @click="show(index)">
            查看
          </Button>
        </template>
      </Table>

      <Modal width="800px" :mask-closable="false" :closable="false" v-model="modal2">
        <div id="printMe" style="position:relative;">
        <Form ref="update"  label-colon=":" label-position="right"
          :label-width="100">
          <h2>出院小结</h2>
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
               出院日期:{{printForm.leaveDate}}
              </Col>
            </Row>
          </div>
          <FormItem label="入院情况" prop="admission">
            {{printForm.admission}}
          </FormItem>
          <FormItem label="入院诊断" prop="admissionDiagnosis">
            {{printForm.admissionDiagnosis}}
          </FormItem>
          <FormItem label="诊疗过程" prop="diagnosisProcess">
            {{printForm.diagnosisProcess}}
          </FormItem>
          <FormItem label="出院状况" prop="dischargeStatus">
            {{printForm.dischargeStatus}}
          </FormItem>
          <FormItem label="出院诊断" prop="dischargeDiagnosis">
            {{printForm.dischargeDiagnosis}}
          </FormItem>
          <FormItem label="出院医嘱" prop="dischargeAdvice">
            {{printForm.dischargeAdvice}}
          </FormItem>
        </Form>
            <div style="position:absolute;right:20px;">
                主治医生签名:___________
            </div>
        </div>
        <div slot="footer">
          <Button v-print="printObj">打印</Button>
          <Button @click="close()">关闭</Button>
        </div>
      </Modal>
      <Modal width="800px" :mask-closable="false" :closable="false" v-model="modal" title="更改小结">
        <Form ref="update" :model="updateForm" :rules="ruleValidate" label-colon=":" label-position="right"
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
                <DatePicker v-model="updateForm.leaveDate" type="date" placement="bottom-end" placeholder="请选择出院时间"
                  format="yyyy-MM-dd"></DatePicker>
              </FormItem>
              </Col>
            </Row>
          </div>
          <input type="hidden" v-model="updateForm.admissionId" />
          <FormItem label="入院情况" prop="admission">
            <Input v-model="updateForm.admission" :rows="6" type="textarea" style="width: 90%" />
          </FormItem>
          <FormItem label="入院诊断" prop="admissionDiagnosis">
            <Input v-model="updateForm.admissionDiagnosis" :rows="6" type="textarea" style="width: 90%" />
          </FormItem>
          <FormItem label="诊疗过程" prop="diagnosisProcess">
            <Input type="textarea" :rows="6" style="width: 90%" v-model="updateForm.diagnosisProcess" />
          </FormItem>
          <FormItem label="出院状况" prop="dischargeStatus">
            <Input type="textarea" :rows="6" style="width: 90%" v-model="updateForm.dischargeStatus" />
          </FormItem>
          <FormItem label="出院诊断" prop="dischargeDiagnosis">
            <Input type="textarea" :rows="6" style="width: 90%" v-model="updateForm.dischargeDiagnosis" />
          </FormItem>
          <FormItem label="出院医嘱" prop="dischargeAdvice">
            <Input type="textarea" :rows="6" style="width: 90%" v-model="updateForm.dischargeAdvice" />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button @click="update()">更改</Button>
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
            type: 'selection',
            width: 60,
            align: 'center'
          },    
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '操作',
            slot: 'action',
            width: 130,
            align: 'center'
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
            key: 'name',
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
            key: 'wardId',
            width: 100
          },
          {
            title: '病床',
            key: 'bid',
            width: 100
          },
          {
            title: '主治医生',
            key: 'doctor',
            width: 150
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
              title:'状态',
              key:'inpatientStatus',
              width: 100,
              render:(h,params)=> {
                  if (params.row.inpatientStatus === 0) {
                    return h('div',"在院") 
                  }else if (params.row.inpatientStatus === 1) {
                    return h('div',"待出院")
                  }else if (params.row.inpatientStatus === 2) {
                    return h('div',"出院")  
                  }

              },
          },
          {
            title: '出院日期',
            key: 'leaveDate',
            width: 200,
            sortable: true,
            render: (h, params) => {
              return h('div', this.moment(params.row.leaveDate).format('YYYY-MM-DD HH:mm:ss'))
            }
          },
          {
            title: '入院情况',
            key: 'admission',
            width: 300,
            render:(h, params) => {
              return h('div', [
                h('span', {
                  style: {display: 'inline-block', 
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'},
                  domProps: {title: params.row.admission},
                  on:{click:(e) => { e.stopPropagation();}}
                }, params.row.admission)
              ]);
          }
          },
          {
            title: '入院诊断',
            key: 'admissionDiagnosis',
            width: 300,
            render:(h, params) => {
              return h('div', [
                h('span', {
                  style: {display: 'inline-block', 
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'},
                  domProps: {title: params.row.admissionDiagnosis},
                  on:{click:(e) => { e.stopPropagation();}}
                }, params.row.admissionDiagnosis)
              ]);
          }
          },
          {
            title: '诊疗过程',
            key: 'diagnosisProcess',
            width: 300,
            render:(h, params) => {
              return h('div', [
                h('span', {
                  style: {display: 'inline-block', 
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'},
                  domProps: {title: params.row.diagnosisProcess},
                  on:{click:(e) => { e.stopPropagation();}}
                }, params.row.diagnosisProcess)
              ]);
          }
          },
          {
            title: '出院状态',
            key: 'dischargeStatus',
            width: 300,
            render:(h, params) => {
              return h('div', [
                h('span', {
                  style: {display: 'inline-block', 
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'},
                  domProps: {title: params.row.dischargeStatus},
                  on:{click:(e) => { e.stopPropagation();}}
                }, params.row.dischargeStatus)
              ]);
          }
          },
          {
            title: '出院诊断',
            key: 'dischargeDiagnosis',
            width: 300,
            render:(h, params) => {
              return h('div', [
                h('span', {
                  style: {display: 'inline-block', 
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'},
                  domProps: {title: params.row.dischargeDiagnosis},
                  on:{click:(e) => { e.stopPropagation();}}
                }, params.row.dischargeDiagnosis)
              ]);
          }
          },
          {
            title: '出院医嘱',
            key: 'dischargeAdvice',
            width: 300,
            render:(h, params) => {
              return h('div', [
                h('span', {
                  style: {display: 'inline-block', 
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'},
                  domProps: {title: params.row.dischargeAdvice},
                  on:{click:(e) => { e.stopPropagation();}}
                }, params.row.dischargeAdvice)
              ]);
          }
          }
        ],
        data: [],
        modal: false,
        modal2: false,
        total: 0,
        deptList: [],
        updateForm: {
          id:'',
          admissionId: '',
          admission: '',
          leaveDate: '',
          admissionDiagnosis: '',
          diagnosisProcess: '',
          dischargeStatus: '',
          dischargeDiagnosis: '',
          dischargeAdvice: ''
        },
        printForm:{
          admission: '',
          leaveDate: '',
          admissionDiagnosis: '',
          diagnosisProcess: '',
          dischargeStatus: '',
          dischargeDiagnosis: '',
          dischargeAdvice: '',
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
          pid: '',
          pname: '',
          doctor:'',
          admissionNumber: '',
          leaveDateStart: '',
          leaveDateEnd: '',
          status:''
        },
        printObj:{
          id:'printMe',
          popTitle: '出院小结',
          extraHead: '<meta http-equiv="Content-Language" content="zh-ch"/>'
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
      this.conditionForm.doctor = JSON.parse(localStorage.getItem("TOKEN")).username;
      this.getLeaveRecord()
    },

    methods: {
      getLeaveRecord() {
        this.$http({
            url: 'leaveRecord/getLeaveRecord',
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
      pageChange(pageNum) {
        this.$http({
            url: 'leaveRecord/getLeaveRecord',
            method: 'GET',
            params: {
              doctor:this.conditionForm.doctor,
              status: this.conditionForm.status,
              pid: this.conditionForm.pid,
              pname: this.conditionForm.pname,
              admissionNumber: this.conditionForm.admissionNumber,
              leaveDateStart: this.conditionForm.leaveDateStart,
              leaveDateEnd: this.conditionForm.leaveDateEnd,
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
        this.$refs.update.resetFields();
        this.modal = false;
      },
      edit(index) {
        this.patient.name = this.data[index].name;
        this.patient.sex = this.data[index].sex;
        this.patient.age = this.data[index].age;
        this.patient.deptName = this.data[index].deptName;
        this.patient.wardId = this.data[index].wardId;
        this.patient.bid = this.data[index].bid;
        this.patient.admissionNumber = this.data[index].admissionNumber;
        this.patient.dateOfAdmission = this.moment(this.data[index].dateOfAdmission).format('YYYY-MM-DD');
        
        this.updateForm.id = this.data[index].id
        this.updateForm.leaveDate = this.moment(this.data[index].leaveDate).format('YYYY-MM-DD')
        this.updateForm.admissionId = this.data[index].admissionId;
        this.updateForm.admission = this.data[index].admission;
        this.updateForm.admissionDiagnosis = this.data[index].admissionDiagnosis;
        this.updateForm.diagnosisProcess = this.data[index].diagnosisProcess;
        this.updateForm.dischargeDiagnosis = this.data[index].dischargeDiagnosis;
        this.updateForm.dischargeStatus = this.data[index].dischargeStatus;
        this.updateForm.dischargeAdvice = this.data[index].dischargeAdvice;
        this.modal = true;
      },
      show(index){
        this.patient.name = this.data[index].name;
        this.patient.sex = this.data[index].sex;
        this.patient.age = this.data[index].age;
        this.patient.deptName = this.data[index].deptName;
        this.patient.wardId = this.data[index].wardId;
        this.patient.bid = this.data[index].bid;
        this.patient.admissionNumber = this.data[index].admissionNumber;
        this.patient.dateOfAdmission = this.moment(this.data[index].dateOfAdmission).format('YYYY-MM-DD');
        
        this.printForm.leaveDate = this.moment(this.data[index].leaveDate).format('YYYY-MM-DD');
        this.printForm.admissionId = this.data[index].admissionId;
        this.printForm.admission = this.data[index].admission;
        this.printForm.admissionDiagnosis = this.data[index].admissionDiagnosis;
        this.printForm.diagnosisProcess = this.data[index].diagnosisProcess;
        this.printForm.dischargeDiagnosis = this.data[index].dischargeDiagnosis;
        this.printForm.dischargeStatus = this.data[index].dischargeStatus;
        this.printForm.dischargeAdvice = this.data[index].dischargeAdvice;

        this.modal2 = true;
      },
      update() {
        this.$refs.update.validate(valid => {
          if (valid) {
            this.$http({
                url: 'leaveRecord/update',
                method: 'POST',
                data: this.updateForm
              })
              .then((res) => {
                if (res.data.status === 200) {
                  this.$Message.info(res.data.data)
                  this.$refs.update.resetFields();
                  this.getLeaveRecord();
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

      },
      close(){
        this.modal2 = false;
      },
      setTime(date){
        this.conditionForm.leaveDateStart = date[0];
        this.conditionForm.leaveDateEnd = date[1];
      },
      selectAllCancel(){
        this.selectiveList = []
      },
      selectAll(selection){
        this.selectiveList = selection
      },
      advicesSelective(selection, row) {
        this.selectiveList = selection
      },
      cancelSelect(selection, row) {
        this.selectiveList = selection
      }, 
      delRecord(){
        if (this.selectiveList.length === 0) {
            this.$Message.info("请选择操作项")
        }else{
            this.$http({
                url:'leaveRecord/delLeaveRecord',
                method:'POST',
                data:this.selectiveList
            })
            .then((res) => {
                if (res.data.status === 200) {
                    this.$Message.info(res.data.data)
                    this.selectiveList = []
                    this.getLeaveRecord();
                }else if (res.data.status === 500) {
                    this.$Message.info(res.data.msg)
                }    
            })
            .catch((err) => {
                console.log(err);
            });
        }
      } 
    }
  }

</script>
<style scoped>

  #btn-box{
      margin: 5px;
      text-align: left;
  }

  #printMe{
    word-wrap: break-word;
    word-break: break-all;
  }

  #page-box {
    margin-top: 10px;
  }

</style>
