<template>
  <div id="registration">
    <!-- 搜索条件组件 -->
    <PatientSelectCard :deptList="deptList" @search="search"></PatientSelectCard>
    <!-- 登记入院 -->
    <div class="admission-btn">
      <Button type="primary" @click="modal = true">登记入院</Button>
      <Modal :mask-closable="false" :closable="false" width="1200px" v-model="modal" title="登记入院信息">
        <Form ref="add" label-colon=":" :rules="ruleValidate" :model="form" label-position="right" :label-width="100">
          <Row>
            <Col span="7">
            <FormItem label="身份证号" prop="pid">
              <AutoComplete v-model="form.pid" :data="patientList" placeholder="请输入身份证号" clearable
                @on-search="getPatientByConditions" @on-select="initForm">
                <Option v-for="patient in patientList" :key="patient.pid" :value="patient.pid">
                  <span>{{patient.pid}}</span>--<span>{{patient.pname}}</span>
                </Option>
              </AutoComplete>
            </FormItem>
            </Col>
            <Col span="4">
            <FormItem label="姓名" prop="pname">
              <AutoComplete v-model="form.pname" :data="patientList" placeholder="请输入姓名" clearable
                @on-search="getPatientByConditions" @on-select="initForm">
                <Option v-for="patient in patientList" :key="patient.pid" :value="patient.pid">
                  <span>{{patient.pid}}</span>--<span>{{patient.pname}}</span>
                </Option>
              </AutoComplete>
            </FormItem>
            </Col>
            <Col span="3">
            <FormItem label="年龄" prop="age">
              <Input v-model="form.age"></Input>
            </FormItem>
            </Col>
            <Col span="4">
            <FormItem label="性别" prop="sex">
              <Select v-model="form.sex">
                <Option value="男">男</Option>
                <Option value="女">女</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="4">
            <FormItem label="医保类型" prop="ptName">
              <Select v-model="form.ptName">
                <Option v-for="pt in patientTypeList" :value="pt.ptName" :key="pt.ptName">{{ pt.ptName }}</Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="4">
            <FormItem label="民族" prop="nation">
              <Select filterable v-model="form.nation">
                <Option v-for="nation in nationList" :value="nation.nationName" :key="nation.no">{{ nation.nationName }}
                </Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="1">&#8195;</Col>
            <Col span="8">
            <FormItem label="出生年月日" prop="birth">
              <DatePicker v-model="form.birth"></DatePicker>
            </FormItem>
            </Col>
            <Col span="5">
            <FormItem label="国籍" prop="nationality">
              <Input v-model="form.nationality"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="6">
            <FormItem label="籍贯" prop="city">
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
            <FormItem label="出生地" prop="born">
              <Input v-model="form.born"></Input>
            </FormItem>
            </Col>
            <Col span="3">
            <FormItem label="婚姻" prop="married">
              <Input v-model="form.married"></Input>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem label="联系电话" prop="tel">
              <Input v-model="form.tel"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="10">
            <FormItem label="现居住地址" prop="currAddr">
              <Input v-model="form.currAddr" />
            </FormItem>
            </Col>
            <Col span="10">
            <FormItem label="户口地址" prop="regAddr">
              <Input v-model="form.regAddr"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="5">
            <FormItem label="紧急联系人" prop="contact">
              <Input v-model="form.contact"></Input>
            </FormItem>
            </Col>
            <Col span="4">
            <FormItem label="关系" prop="contact">
              <Input v-model="form.conRel"></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="联系电话" prop="conTel">
              <Input v-model="form.conTel"></Input>
            </FormItem>
            </Col>
          </Row>
          <hr><br>
          <Row>
            <Col span="12">
            <FormItem label="诊断1" prop="diagnosis01">
              <Input v-model="form.diagnosis01"></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="诊断2" prop="diagnosis02">
              <Input v-model="form.diagnosis02"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="6">
            <FormItem label="收治医生" prop="admittedDoc">
              <Input v-model="form.admittedDoc"></Input>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem label="主诊医生" prop="visitingDoc">
              <Input v-model="form.visitingDoc"></Input>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem label="主治医生" prop="attendingDoc">
              <Input v-model="form.attendingDoc"></Input>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem label="入院科室" prop="deptName">
              <Select clearable filterable v-model="form.deptName">
                <Option v-for="item in deptList" :value="item.deptName" :key="item.deptName">{{ item.deptName }}
                </Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="4">
            <FormItem label="病房号" prop="iwardId">
              <Input v-model="form.iwardId" disabled></Input>
            </FormItem>
            </Col>
            <Col span="4">
            <FormItem label="病床" prop="bid">
              <Input v-model="form.bid" disabled></Input>
            </FormItem>
            </Col>
            <Col span="3">&#8195;</Col>
            <Col span="6">
            <FormItem label="医保登记号" prop="medicalNumber">
              <Input v-model="form.medicalNumber"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="6">
            <FormItem label="入院日期" prop="dateOfAdmission">
              <DatePicker disabled v-model="form.dateOfAdmission" disabled></DatePicker>
            </FormItem>
            </Col>
            <Col span="1" style="text-align:center;padding-left:20px;">
            _
            </Col>
            <Col span="6">
            <FormItem label="出院日期" prop="dateOfDischarge">
              <DatePicker disabled v-model="form.dateOfDischarge" disabled></DatePicker>
            </FormItem>
            </Col>
            <Col span="3">&#8195;</Col>
            <Col span="6">
            <FormItem label="住院号" prop="admissionNumber">
              <Input disabled v-model="form.admissionNumber" />
            </FormItem>
            </Col>
          </Row>
          <hr><br>
          <Row>
            <Col span="5">
            <FormItem label="预交押金" prop="deposit">
              <Input v-model="form.deposit"></Input>
            </FormItem>
            </Col>
            <Col span="7">&#8195;</Col>
            <Col span="5">
            <FormItem label="延迟付款" prop="status">
              <Select v-model="form.status">
                <Option value="0">是</Option>
                <Option value="1">否</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="2">&#8195;</Col>
            <Col span="5">
            <FormItem label="付款方式" prop="payment">
              <Select v-model="form.payment">
                <Option v-for="payment in paymentTypeList" :value="payment.paymentType" :key="payment.paymentType">
                  {{ payment.paymentType }}</Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Input style="display:none;" v-model="form.sid" />
        </Form>
        <div slot="footer">
          <Button type="primary" @click="addInpatient">确定</Button>
          <Button type="error" @click="cancelAdd">取消</Button>
        </div>
      </Modal>

      <Modal :mask-closable="false" :closable="false" width="1200px" v-model="modal2" title="更改入院信息">
        <Form ref="update" label-colon=":" :rules="ruleValidate" :model="updateForm" label-position="right"
          :label-width="100">
          <Row>
            <Col span="7">
            <FormItem label="身份证号" prop="pid">
              <Input disabled v-model="updateForm.pid" />
            </FormItem>
            </Col>
            <Col span="4">
            <FormItem label="姓名" prop="pname">
              <Input v-model="updateForm.pname" />
            </FormItem>
            </Col>
            <Col span="3">
            <FormItem label="年龄" prop="age">
              <Input v-model="updateForm.age"></Input>
            </FormItem>
            </Col>
            <Col span="4">
            <FormItem label="性别" prop="sex">
              <Select v-model="updateForm.sex">
                <Option value="男">男</Option>
                <Option value="女">女</Option>
              </Select>
              </Select>
            </FormItem>
            </Col>
            <Col span="4">
            <FormItem label="医保类型" prop="ptName">
              <Select v-model="updateForm.ptName">
                <Option v-for="pt in patientTypeList" :value="pt.ptName" :key="pt.ptName">{{ pt.ptName }}</Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="4">
            <FormItem label="民族" prop="nation">
              <Select filterable v-model="updateForm.nation">
                <Option v-for="nation in nationList" :value="nation.nationName" :key="nation.no">{{ nation.nationName }}
                </Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="1">&#8195;</Col>
            <Col span="8">
            <FormItem label="出生年月日" prop="birth">
              <DatePicker v-model="updateForm.birth"></DatePicker>
            </FormItem>
            </Col>
            <Col span="5">
            <FormItem label="国籍" prop="nationality">
              <Input v-model="updateForm.nationality"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="6">
            <FormItem label="籍贯" prop="city">
              <Row>
                <Col span="12">
                <Input v-model="updateForm.province">
                <span slot="append">省</span>
                </Input>
                </Col>
                <Col span="12">
                <Input v-model="updateForm.city">
                <span slot="append">市</span>
                </Input>
                </Col>
              </Row>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="出生地" prop="born">
              <Input v-model="updateForm.born"></Input>
            </FormItem>
            </Col>
            <Col span="3">
            <FormItem label="婚姻" prop="married">
              <Input v-model="updateForm.married"></Input>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem label="联系电话" prop="tel">
              <Input v-model="updateForm.tel"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="10">
            <FormItem label="现居住地址" prop="currAddr">
              <Input v-model="updateForm.currAddr"></Input>
            </FormItem>
            </Col>
            <Col span="10">
            <FormItem label="户口地址" prop="regAddr">
              <Input v-model="updateForm.regAddr"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="5">
            <FormItem label="紧急联系人" prop="contact">
              <Input v-model="updateForm.contact"></Input>
            </FormItem>
            </Col>
            <Col span="4">
            <FormItem label="关系" prop="contact">
              <Input v-model="updateForm.conRel"></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="联系电话" prop="conTel">
              <Input v-model="updateForm.conTel"></Input>
            </FormItem>
            </Col>
          </Row>
          <hr><br>
          <Row>
            <Col span="12">
            <FormItem label="诊断1" prop="diagnosis01">
              <Input v-model="updateForm.diagnosis01"></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="诊断2" prop="diagnosis02">
              <Input v-model="updateForm.diagnosis02"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="6">
            <FormItem label="收治医生" prop="admittedDoc">
              <Input v-model="updateForm.admittedDoc"></Input>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem label="主诊医生" prop="visitingDoc">
              <Input v-model="updateForm.visitingDoc"></Input>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem label="主治医生" prop="attendingDoc">
              <Input v-model="updateForm.attendingDoc"></Input>
            </FormItem>
            </Col>
            <Col span="6">
            <FormItem label="入院科室" prop="deptName">
              <Select clearable filterable v-model="updateForm.deptName">
                <Option v-for="item in deptList" :value="item.deptName" :key="item.deptName">{{ item.deptName }}
                </Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="4">
            <FormItem label="病房号" prop="iwardId">
              <Input v-model="updateForm.iwardId" disabled></Input>
            </FormItem>
            </Col>
            <Col span="4">
            <FormItem label="病床" prop="bid">
              <Input v-model="updateForm.bid" disabled></Input>
            </FormItem>
            </Col>
            <Col span="3">&#8195;</Col>
            <Col span="6">
            <FormItem label="医保登记号" prop="medicalNumber">
              <Input v-model="updateForm.medicalNumber"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="6">
            <FormItem label="入院日期" prop="dateOfAdmission">
              <DatePicker disabled v-model="updateForm.dateOfAdmission" disabled></DatePicker>
            </FormItem>
            </Col>
            <Col span="1" style="text-align:center;padding-left:20px;">
            _
            </Col>
            <Col span="6">
            <FormItem label="出院日期" prop="dateOfDischarge">
              <DatePicker disabled v-model="updateForm.dateOfDischarge" disabled></DatePicker>
            </FormItem>
            </Col>
            <Col span="3">&#8195;</Col>
            <Col span="6">
            <FormItem label="住院号" prop="admissionNumber">
              <Input disabled v-model="updateForm.admissionNumber" />
            </FormItem>
            </Col>
          </Row>
          <hr><br>
          <Row>
            <Col span="5">
            <FormItem label="预交押金" prop="deposit">
              <Input v-model="updateForm.deposit" disabled></Input>
            </FormItem>
            </Col>
            <Col span="7">&#8195;</Col>
            <Col span="5">
            <FormItem label="延迟付款" prop="status">
              <Select v-model="updateForm.status" disabled>
                <Option value="1">是</Option>
                <Option value="0">否</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="2">&#8195;</Col>
            <Col span="5">
            <FormItem label="付款方式" prop="payment">
              <Select v-model="updateForm.payment" disabled>
                <Option v-for="payment in paymentTypeList" :value="payment.paymentType" :key="payment.paymentType">
                  {{ payment.paymentType }}</Option>
              </Select>
            </FormItem>
            </Col>
          </Row>
          <input type="hidden" v-model="updateForm.id">
        </Form>
        <div slot="footer">
          <Button type="primary" @click="update">更改</Button>
          <Button type="error" @click="cancelUpdate">取消</Button>
        </div>
      </Modal>
    </div>
    <!-- 查询结果表格之类的 -->
    <div class="table-box">
      <Table border :columns="columns" :data="data" @on-row-dblclick="showRow"></Table>
    </div>
    <!-- 分页 -->
    <div class="page-box">
      <Page :total="total" show-elevator @on-change="pageChange" />
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
        data: [],
        modal: false,
        modal2: false,
        deptList: [],
        nationList: [],
        patientList: [],
        paymentTypeList: [],
        patientTypeList: [],
        form: {
          pid: '',
          pname: '',
          age: '',
          sex: '',
          ptName: '',
          nation: '',
          nationality: '',
          province: '',
          city: '',
          born: '',
          birth: '',
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
          deptName: '',
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
        },
        updateForm: {
          id: '',
          pid: '',
          pname: '',
          age: '',
          sex: '',
          ptName: '',
          nation: '',
          nationality: '',
          province: '',
          city: '',
          born: '',
          birth: '',
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
          deptName: '',
          iwardId: '',
          bid: '',
          dateOfAdmission: '',
          dateOfDischarge: '',
          medicalNumber: '',
          admissionNumber: '',
          deposit: '',
          status: '',
          payment: ''
        },
        deptNameSelective: '',
        pid: '',
        pname: '',
        admissionNumber: '',
        admissionOfDateStart: '',
        admissionOfDateEnd: '',
        total: 0,
        sid:'',
        pageNum: 1,
        ruleValidate: {
          pid: [{
              required: true,
              message: '身份证不能为空',
              trigger: 'blur'
            },
            {
              type: 'string',
              pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
              message: '请输入正确的身份证号',
              trigger: 'change'
            }
          ],
          pname: [{
            required: true,
            message: '姓名不能为空',
            trigger: 'change'
          }],
          age: [{
              required: true,
              message: '年龄不能为空',
              trigger: 'blur'
            },
            {
              pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
              message: '请输入数字',
              trigger: 'change'
            }
          ],
          sex: [{
            required: true,
            message: '性别不能为空',
            trigger: 'change'
          }],
          ptName: [{
            required: true,
            message: '类型不能为空',
            trigger: 'change'
          }],
          nation: [{
            required: true,
            message: '民族不能为空',
            trigger: 'change'
          }],
          nationality: [{
            required: true,
            message: '国籍不能为空',
            trigger: 'change'
          }],
          city: [{
            required: true,
            message: '籍贯不能为空',
            trigger: 'change'
          }],
          birth: [{
            required: true,
            pattern: /.+/,
            message: '出生年月日不能为空',
            trigger: 'change'
          }],
          currAddr: [{
            required: true,
            message: '现居住地址不能为空',
            trigger: 'change'
          }, ],
          regAddr: [{
            required: true,
            message: '户口地址不能为空',
            trigger: 'change'
          }, ],
          tel: [{
              required: true,
              message: '手机号不能为空',
              trigger: 'blur'
            },
            {
              type: 'string',
              pattern: /^[1][3-9][0-9]{9}$/,
              message: '请输入正确手机号',
              trigger: 'change'
            }
          ],
          deptName: [{
            required: true,
            message: '入院科室不能为空',
            trigger: 'change'
          }, ],
          deposit: [{
              required: true,
              message: '押金不能为空',
              trigger: 'blur'
            },
            {
              pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
              message: '请输入数字',
              trigger: 'blur'
            }
          ],
          status: [{
            required: true,
            message: '不能为空',
            trigger: 'change'
          }],
          payment: [{
            required: true,
            type: 'string',
            message: '不能为空',
            trigger: 'change'
          }],
          admittedDoc: [{
            required: true,
            message: '收治医生不能为空',
            trigger: 'change'
          }]
        }
      }
    },
    components: {
      PatientSelectCard
    },
    created() {
      this.form.sid = JSON.parse(localStorage.getItem("TOKEN")).username;
      this.sid = JSON.parse(localStorage.getItem("TOKEN")).username;
      this.getCommon();
      this.getInpatientInformation();  
    },
    methods: {
      cancelAdd() {
        this.$Message.info("取消登记")
        this.modal = false;
        this.$refs.add.resetFields()
        this.form.sid = this.sid
      },
      getCommon() {
        this.$http({
            url: 'common/getCommon',
            method: 'GET'
          })
          .then(res => {
            if (res.status == 200) {
              this.deptList = res.data.data.deptList;
              this.nationList = res.data.data.nationList;
              this.paymentTypeList = res.data.data.paymentTypeList;
              this.patientTypeList = res.data.data.patientTypeList;
            }else if (res.data.status === 500) {
            this.$Message.info(res.data.msg)
            } 
          })
          .catch(err => {
            console.log(err);
          })
      },
      search(deptNameSelective, pid, pname, admissionNumber, admissionOfDate) {
        this.deptNameSelective = deptNameSelective
        this.pid = pid
        this.pname = pname
        this.admissionNumber = admissionNumber
        this.admissionOfDateStart = admissionOfDate[0]
        this.admissionOfDateEnd = admissionOfDate[1]
        this.$http({
            url: 'register/getInformationByCondition',
            method: 'GET',
            params: {
              deptName: this.deptNameSelective,
              pid: this.pid,
              pname: this.pname,
              admissionNumber: this.admissionNumber,
              admissionOfDateStart: this.admissionOfDateStart,
              admissionOfDateEnd: this.admissionOfDateEnd
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
            url: 'register/getInformationByCondition',
            method: 'GET',
            params: {
              deptName: this.deptNameSelective,
              pid: this.pid,
              pname: this.pname,
              admissionOfDateStart: this.admissionOfDateStart,
              admissionOfDateEnd: this.admissionOfDateEnd
            }
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
      addInpatient() {
        this.$refs.add.validate(valid => {
          if (valid) {
            this.$http({
                url: "register/add",
                method: "POST",
                data: this.form
              })
              .then((res) => {
                if (res.data.status === 200) {
                  this.$Message.info(res.data.data)
                  this.modal = false;
                  this.$refs.add.resetFields()
                  this.patientList = []
                  this.getInpatientInformation();
                } else if (res.data.status === 500) {
                  this.$refs.add.resetFields()
                  this.modal = false;
                  this.$Message.info(res.data.msg)
                }
              })
              .catch((err) => {
                console.log(err)
                this.$Message.info("服务器出错")
              });
          } else {
            this.$Message.info("请将信息补充完整再提交！");
          }
        })
      },
      getPatientByConditions(value) {
        this.$http({
            url: 'patient/getPatientByCondition',
            method: "GET",
            params: {
              pid: this.form.pid,
              pname: this.form.pname
            }
          })
          .then(res => {
            if (res.data.status == 200) {
              this.patientList = res.data.data.list;
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err)
            this.$Message.info("服务器出错")
          })
      },
      initForm(value) {
        this.$http({
            url: 'patient/getPatientByPid',
            method: 'GET',
            params: {
              pid: value
            }
          })
          .then(res => {
            if (res.data.status === 200) {
              this.patientList = res.data.data;
              this.form = {
                pid: this.patientList.pid,
                pname: this.patientList.pname,
                age: this.patientList.age,
                sex: this.patientList.sex,
                ptName: this.patientList.ptName,
                nation: this.patientList.nation,
                nationality: this.patientList.nationality,
                province: this.patientList.province,
                city: this.patientList.city,
                birth: this.patientList.birth,
                born: this.patientList.born,
                married: this.patientList.married,
                tel: this.patientList.tel,
                currAddr: this.patientList.currAddr,
                regAddr: this.patientList.regAddr,
                contact: this.patientList.contact,
                conRel: this.patientList.conRel,
                conTel: this.patientList.conTel,
                diagnosis01: this.form.diagnosis01,
                diagnosis02: this.form.diagnosis02,
                admittedDoc: this.form.admittedDoc,
                visitingDoc: this.form.visitingDoc,
                attendingDoc: this.form.attendingDoc,
                deptName: this.form.deptName,
                iwardId: this.form.iwardId,
                bid: this.form.bid,
                dateOfAdmission: this.form.dateOfAdmission,
                dateOfDischarge: this.form.dateOfDischarge,
                medicalNumber: this.form.medicalNumber,
                admissionNumber: this.form.admissionNumber,
                deposit: this.form.deposit,
                status: this.form.status,
                payment: this.form.payment,
                sid: this.sid
              }
            } else if (res.data.status === 500) {
              this.$Message.info("找不到该病患")
            }
          })
          .catch(err => {
            this.$Message.error("服务器出错！")
          })

      },
      pageChange(pageNum) {
        this.$http({
            url: 'register/getInformationByCondition',
            method: 'GET',
            params: {
              deptName: this.deptNameSelective,
              pid: this.pid,
              pname: this.pname,
              admissionNumber: this.admissionNumber,
              admissionOfDateStart: this.admissionOfDateStart,
              admissionOfDateEnd: this.admissionOfDateEnd,
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
      showRow(value, index) {
        this.$http({
            url: "register/getInformationById",
            method: "GET",
            params: {
              id: this.data[index].id
            }
          })
          .then(res => {
            if (res.data.status === 200) {
              this.modal2 = true;
              this.updateForm = res.data.data
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      update() {
        this.$http({
            url: 'register/updateAdmission',
            method: 'POST',
            data: this.updateForm
          })
          .then(res => {
            if (res.data.status === 200) {
              this.modal2 = false;
              this.$Message.info("更改成功")
              this.getInpatientInformation();
            } else if (res.data.status === 500) {
              this.modal2 = false;
              this.$Message.info("更改失败")
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      cancelUpdate() {
        this.modal2 = false;
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
    margin-top: 10px;
  }

</style>
