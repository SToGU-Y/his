<template>
  <div id="patientMessage">
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
                <Option value="是">是</Option>
                <Option value="否">否</Option>
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
  </div>
</template>

<script>
  export default {
    data() {
      return {
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

    components: {},

    computed: {},

    methods: {}
  }

</script>
<style scoped>
</style>
