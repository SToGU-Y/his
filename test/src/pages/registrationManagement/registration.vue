<template>
  <div id="registration">
    <!-- 搜索条件组件 -->
    <PatientSelectCard 
    :deptList="deptList"
    @search="search"
    ></PatientSelectCard>
    <!-- 登记入院 -->
    <div class="admission-btn">
      <Button type="primary" @click="modal = true">登记入院</Button>
      <Modal width="1200px" :loading="loading" v-model="modal" title="登记入院信息">
        <Form label-colon=":" :model="form" label-position="right" :label-width="100">   
          <Row>
            <Col span="5">
            <FormItem label="身份证号">
              <Input v-model="form.pid"></Input>
            </FormItem>
            </Col>
            <Col span="5">
            <FormItem label="姓名">
              <Input v-model="form.pname"></Input>
            </FormItem>
            </Col>
            <Col span="3">
            <FormItem label="年龄">
              <Input v-model="form.age"></Input>
            </FormItem>
            </Col>
            <Col span="4">
            <FormItem label="性别">
              <Select v-model="form.sex">
                <Option value="男">男</Option>
                <Option value="女">女</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="5">
            <FormItem label="医保类型">
              <Select v-model="form.ptId">
                <Option v-for="pt in patientTypeList" :value="pt.ptId" :key="pt.ptId">{{ pt.ptName }}</Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="4">
            <FormItem label="民族">
              <Select filterable v-model="form.nation">
                <Option v-for="nation in nationList" :value="nation.nationName" :key="nation.no">{{ nation.nationName }}</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="1">&#8195;</Col>
            <Col span="8">
            <FormItem label="出生年月日">
              <Input v-model="form.birth" value="0000-00-00 00:00:00"></Input>
            </FormItem>
            </Col>
            <Col span="5">
            <FormItem label="国籍">
              <Input v-model="form.nationality"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="6">
            <FormItem label="籍贯">
              <Row>
                <Col span="12">
                <Input v-model="form.province">
                <span slot="append">省</span>
                </Input>

                </Col>
                <Col span="12">
                <Input v-model="form.city">
                <span slot="append">市</span>
                </Input>
                </Col>
              </Row>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="出生地">
              <Input v-model="form.born"></Input>
            </FormItem>
            </Col>
            <Col span="3">
            <FormItem label="婚姻">
              <Input v-model="form.married"></Input>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem label="联系电话">
              <Input v-model="form.tel"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="10">
            <FormItem label="现居住地址">
              <Input v-model="form.currAddr"></Input>
            </FormItem>
            </Col>
            <Col span="10">
            <FormItem label="户口地址">
              <Input v-model="form.regAddr"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="5">
            <FormItem label="紧急联系人">
              <Input v-model="form.contact"></Input>
            </FormItem>
            </Col>
            <Col span="4">
            <FormItem label="关系">
              <Input v-model="form.conrel"></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="联系电话">
              <Input v-model="form.contel"></Input>
            </FormItem>
            </Col>
          </Row>
          <hr><br>
          <Row>
            <Col span="12">
            <FormItem label="诊断1">
              <Input v-model="form.diagnosis01"></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="诊断2">
              <Input v-model="form.diagnosis02"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="6">
            <FormItem label="收治医生">
              <Input v-model="form.admitteddoc"></Input>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem label="主诊医生">
              <Input v-model="form.visitingdoc"></Input>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem label="主治医生">
              <Input v-model="form.attendingdoc"></Input>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem label="入院科室">
              <Select clearable filterable v-model="form.deptId">
                <Option v-for="item in deptList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="4">
            <FormItem label="病房号">
              <Input v-model="form.iwardId"></Input>
            </FormItem>
            </Col>
            <Col span="4">
            <FormItem label="病床">
              <Input v-model="form.bid"></Input>
            </FormItem>
            </Col>
            <Col span="3">&#8195;</Col>
            <Col span="6">
            <FormItem label="医保登记号">
              <Input v-model="form.medicalNumber"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="6">
            <FormItem label="入院日期">
              <Input disabled v-model="form.dateOfAdmission" disabled></Input>
            </FormItem>
            </Col>
            <Col span="1" style="text-align:center;padding-left:20px;">
            _
            </Col>
            <Col span="6">
            <FormItem label="出院日期">
              <Input disabled v-model="form.dateOfDischarge" disabled></Input>
            </FormItem>
            </Col>
            <Col span="3">&#8195;</Col>
            <Col span="6">
              <FormItem label="住院号">
                <Input disabled v-model="form.admissionNumber"/>
                </FormItem>
            </Col>
          </Row>
          <hr><br>
          <Row>
            <Col span="4">
            <FormItem label="预交押金">
              <Input v-model="form.deposit"></Input>
            </FormItem>
            </Col>
            <Col span="10">&#8195;</Col>
            <Col span="4">
            <FormItem label="是否延迟付款">
              <Select v-model="form.status">
                <Option value="1">是</Option>
                <Option value="0">否</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="2">&#8195;</Col>
            <Col span="4">
            <FormItem label="押金付款方式">
              <Select v-model="form.payment">
                <Option v-for="payment in paymentTypeList" :value="payment.paymentNo" :key="payment.paymentNo">{{ payment.paymentType }}</Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Input style="display:none;" v-model="form.sid"/>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="ok">确定</Button>
          <Button type="error" @click="cancel">取消</Button>
        </div>
      </Modal>
    </div>
    <!-- 查询结果表格之类的 -->
    <div class="table-box">
      <Table height="500px" border :columns="columns" :data="data"></Table>
    </div>
    <!-- 分页 -->
    <div class="page-box">
      <Page :total="100" show-elevator />
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
        data: [{
          medicalNumber: '41544',
          pid: '554541152',
          admissionNumber: '892245',
          pname: '张三',
          sex: '男',
          age: '58',
          ptId: '自费',
          birth: '1989-01-01',
          diagnosis01: '没救了',
          diagnosis02: '除非有钱',
          deptId: '心管科',
          admittedDoc: '李四',
          attendingDoc: '王五',
          visitingDoc: '赵六',
          iwardId: 'Q512',
          bid: '9',
          dateOfAdmission: '1563-02-01',
          regAddr: '地球村',
          tel: '556552456455'
        }],
        modal: false,
        deptList:[],
        nationList:[],
        paymentTypeList:[],
        patientTypeList:[],
        loading: false,
        form: {
          pid: '',
          pname: '',
          age: '',
          sex: '',
          ptId: '',
          nation: '',
          nationality: '',
          province: '',
          city: '',
          born: '',
          married: '',
          tel: '',
          currAddr: '',
          regAddr: '',
          contact: '',
          conRel: '',
          conTel: '',
          diagnosis01: '',
          diagnosis02: '',
          admittedDoc: '',
          visitingDoc: '',
          attendingDoc: '',
          deptId: '',
          iwardId: '',
          bid: '',
          dateOfAdmission: '',
          dateOfDischarge: '',
          medicalNumber: '',
          admissionNumber: '',
          deposit: '',
          status: '',
          payment: '',
          sid: ''
        }
      }
    },
    components: {
      PatientSelectCard
    },
    created(){
      this.getCommon();
      this.getInpatientInformation();
    },
    computed: {},
    methods: {
      ok() {
        this.$Message.info("登记成功！")
        this.modal = false;
        this.form = {
          pid: '',
          pname: '',
          age: '',
          sex: '',
          ptId: '',
          nation: '',
          nationality: '',
          province: '',
          city: '',
          born: '',
          married: '',
          tel: '',
          currAddr: '',
          regAddr: '',
          contact: '',
          conRel: '',
          conTel: '',
          diagnosis01: '',
          diagnosis02: '',
          admittedDoc: '',
          visitingDoc: '',
          attendingDoc: '',
          deptId: '',
          iwardId: '',
          bid: '',
          dateOfAdmission: '',
          dateOfDischarge: '',
          medicalNumber: '',
          admissionNumber: '',
          deposit: '',
          status: '',
          payment: '',
          sid: ''
        }
      },
      cancel() {
        this.$Message.info("取消登记")
        this.modal = false;
        this.form={
          pid: '',
          pname: '',
          age: '',
          sex: '',
          ptId: '',
          nation: '',
          nationality: '',
          province: '',
          city: '',
          born: '',
          married: '',
          tel: '',
          currAddr: '',
          regAddr: '',
          contact: '',
          conRel: '',
          conTel: '',
          diagnosis01: '',
          diagnosis02: '',
          admittedDoc: '',
          visitingDoc: '',
          attendingDoc: '',
          deptId: '',
          iwardId: '',
          bid: '',
          dateOfAdmission: '',
          dateOfDischarge: '',
          medicalNumber: '',
          admissionNumber: '',
          deposit: '',
          status: '',
          payment: '',
          sid: ''
        }
        
      },
      getCommon(){
        this.$http({
          url: 'http://localhost:8081/common/getCommon',
          method: 'GET'
        })
        .then(res=>{
          if (res.status==200) {
            this.deptList = res.data.data.deptList;
            this.nationList = res.data.data.nationList;
            this.paymentTypeList = res.data.data.paymentTypeList;
            this.patientTypeList = res.data.data.patientTypeList;
            console.log(this.paymentTypeList)
          }
        })
        .catch(err=>{
            console.log(err);
        })
      },
      search(deptIdSelective,pid,pname,admissionNumber,admissionOfDateRange){
        console.log(deptIdSelective,pid,pname,admissionNumber,admissionOfDateRange)
      },
      getInpatientInformation(){
        this.$http({
          url: 'http://localhost:8081/common/getInpatient',
          method: 'GET'
        })
        .then(res=>{
          this.data = res.data.data;
        })
        .catch(err=>{})
      }

    }
  }

</script>
<style scoped>
  #cardItem {
    text-align: left;
  }

  #cardItem input {
    margin-right: 5px;
  }

  .admission-btn {
    text-align: left;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .page-box {
    margin-top: 5px;
  }

</style>
