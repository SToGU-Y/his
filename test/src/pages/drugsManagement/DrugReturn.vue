<style scoped>
  #btn-box {
    text-align: left;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  #page-box {
    margin-top: 7px;
  }

</style>
<template>
  <div id="drugReturn">
    <!-- 条件筛选模块 -->
    <PatientSelectCard :deptList="deptList" @search="search"></PatientSelectCard>
    <div id="btn-box">
      <Modal :mask-closable="false" :closable="false" v-model="modal" title="发放药品">
        <Form ref="returnback" label-colon=":" :rules="ruleValidate" :model="form" label-position="right"
          :label-width="100">
          <FormItem label="药品编号" prop="drugNo">
            <AutoComplete v-model="form.drugNo" :data="drugList" placeholder="请输入药品编号" clearable @on-search="getDrug"
              @on-select="initForm">
              <Option v-for="drug in drugList" :key="drug.drugId" :value="drug.drugId">
                <span>{{drug.drugNo}}</span>--<span>{{drug.drugName}}</span>--<span>{{drug.drugSpecifications}}</span>--<span>{{drug.doseUnit}}</span>
              </Option>
            </AutoComplete>
          </FormItem>
          <FormItem label="药品名称" prop="drugName">
            <AutoComplete v-model="form.drugName" :data="drugList" placeholder="请输入药品名称" clearable @on-search="getDrug"
              @on-select="initForm">
              <Option v-for="drug in drugList" :key="drug.drugId" :value="drug.drugId">
                <span>{{drug.drugNo}}</span>--<span>{{drug.drugName}}</span>--<span>{{drug.drugSpecifications}}</span>--<span>{{drug.doseUnit}}</span>
              </Option>
            </AutoComplete>
          </FormItem>
          <FormItem label="药品单价" prop="drugPrice">
            <Input  v-model="form.drugPrice" />
          </FormItem>
          <FormItem label="药品规格" prop="drugSpecifications">
            <Input  v-model="form.drugSpecifications" />
          </FormItem>
          <FormItem label="剂量单位" prop="doseUnit">
            <Input  v-model="form.doseUnit" />
          </FormItem>
          <FormItem label="药品类型" prop="drugType">
            <Input v-model="form.drugType"/>
          </FormItem>
          <FormItem label="单位" prop="drugUnit">
            <Input  v-model="form.drugUnit" />
          </FormItem>
          <FormItem label="退还药品数量" prop="drugReturnNum">
            <Input v-model="form.drugReturnNum" />
          </FormItem>
          <FormItem label="原因" prop="reason">
            <Input type="textarea" :row="4" v-model="form.reason" />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="add()">退药</Button>
          <Button @click="cancelAdd()">取消</Button>
        </div>
      </Modal>
    </div>
    <div id="table-box">
      <Table height="540px" :columns="columns" :data="data">
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" @click="back(index)">退药</Button>
        </template>
      </Table>
    </div>
    <!-- 分页模块 -->
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
            width: 150,
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
          }
        ],
        data: [],
        drugList: [],
        total: 0,
        modal: false,
        deptList: [],
        conditionForm: {
          deptName: '',
          pid: '',
          pname: '',
          admissionId: '',
          admissionOfDateStart: '',
          admissionOfDateEnd: ''
        },
        form: {
          admissionId: '',
          drugId: '',
          drugNo: '',
          drugType:'',
          drugName: '',
          drugReturnNum: '',
          drugPrice: '',
          reason: '',
          drugSpecifications: '',
          doseUnit: '',
          drugUnit: '',
          operator: ''
        },
        token: '',
        ruleValidate: {
          drugName: [{
            required: true,
            message: '药名不能为空',
            trigger: 'change'
          }],
          drugNo: [{
              required: true,
              message: '编号不能为空',
              trigger: 'blur'
            },
            {
              pattern: /^\d+(\.\d+)?$/,
              message: '请输入数字',
              trigger: 'change'
            }
          ],
          drugOfferNum: [{
              required: true,
              message: '数量不能为空',
              trigger: 'blur'
            },
            {
              pattern: /^\d+(\.\d+)?$/,
              message: '请输入数字',
              trigger: 'blur'
            }
          ],
                    drugPrice: [{
              required: true,
              message: '单价不能为空',
              trigger: 'blur'
            },
            {
              pattern: /^\d+(\.\d+)?$/,
              message: '请输入数字',
              trigger: 'blur'
            }
          ],
          drugSpecifications:[{
            required: true,
            message: '规格不能为空',
            trigger: 'change'
          }],
          drugUnit:[{
            required: true,
            message: '单位不能为空',
            trigger: 'change'
          }],
          doseUnit:[{
            required: true,
            message: '剂量单位不能为空',
            trigger: 'change'
          }],
          drugType:[{
            required: true,
            message: '类型不能为空',
            trigger: 'change'
          }],
          reason: [{
            required: true,
            message: '原因不能为空',
            trigger: 'blur'
          }]
        }
      }
    },

    components: {
      PatientSelectCard
    },
    created() {
      this.getDept();
      this.getInpatientInformation();
      this.token = JSON.parse(localStorage.getItem("TOKEN")).token;
      this.form.operator = JSON.parse(localStorage.getItem("TOKEN")).username;
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
      getInpatientInformation() {
        this.$http({
            url: 'register/getInformationByCondition',
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
            url: 'register/getInformationByCondition',
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
            url: 'register/getInformationByCondition',
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
      back(index) {
        this.modal = true;
        this.form.admissionId = this.data[index].id
      },
      add() {
        this.$refs.returnback.validate(valid => {
          if (valid) {
            this.$http({
                url: 'drug/addDrugReturn',
                method: 'POST',
                data: this.form
              })
              .then((res) => {
                if (res.data.status === 200) {
                  this.modal = false;
                  this.$Message.info(res.data.data)
                } else if (res.data.status === 500) {
                  this.modal = false;
                  this.$Message.info(res.data.msg)
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            this.$Message.info("请填写完整");
          }
        })

      },
      cancelAdd() {
        this.$refs.returnback.resetFields()
        this.modal = false
      },
      initForm(value) {
        this.$http({
            url: 'drug/getDrugById',
            method: 'GET',
            params: {
              drugId: value
            }
          })
          .then(res => {
            if (res.data.status === 200) {
              this.drugList = res.data.data;
              this.form.drugId = this.drugList.drugId
              this.form.drugNo = this.drugList.drugNo
              this.form.drugName = this.drugList.drugName
              this.form.drugPrice = this.drugList.drugPrice
              this.form.drugType = this.drugList.drugType
              this.form.drugSpecifications = this.drugList.drugSpecifications
              this.form.drugUnit = this.drugList.drugUnit
              this.form.doseUnit = this.drugList.doseUnit
            } else if (res.data.status === 500) {
              this.$Message.info("找不到该药品")
            }
          })
          .catch(err => {
            this.$Message.error("服务器出错！")
          })
      },
      getDrug() {
        this.$http({
            url: 'drug/getAllDrug',
            method: 'GET',
            params: {
              drugNo: this.form.drugNo,
              drugName: this.form.drugName
            }
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.drugList = res.data.data.list;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }

</script>
