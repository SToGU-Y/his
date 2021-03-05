<template>
  <div id="costAdd">
    <!-- 搜索条件组件 -->
    <PatientSelectCard :deptList="deptList" @search="search"></PatientSelectCard>
    <!-- 查询结果表格之类的 -->
    <div class="table-box">
      <Table border :columns="columns" :data="data">
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" @click="addCost(index)">费用录入</Button>
        </template>
      </Table>

      <Modal :mask-closable="false" :closable="false" v-model="modal" title="费用录入">
        <Form ref="add" label-colon=":" :rules="ruleValidate" :model="addForm" label-position="right"
          :label-width="100">
          <FormItem label="项目编号" prop="costNo">
            <AutoComplete v-model="addForm.costNo" :data="costItemList" placeholder="请输入项目编号" clearable
              @on-search="getCostItem" @on-select="initForm" @on-clear="clear">
              <Option v-for="costItem in costItemList" :key="costItem.costItemNo" :value="costItem.costItemNo">
                <span>{{costItem.costItemNo}}</span>--<span>{{costItem.costItemName}}</span>--<span>{{costItem.costItemType}}</span>--<span>{{costItem.costItemPrice}}</span>
              </Option>
            </AutoComplete>
          </FormItem>
          <FormItem label="项目名" prop="costName">
            <AutoComplete v-model="addForm.costName" :data="costItemList" placeholder="请输入项目名称" clearable
              @on-search="getCostItem" @on-select="initForm" @on-clear="clear">
              <Option v-for="costItem in costItemList" :key="costItem.costItemNo" :value="costItem.costItemNo">
                <span>{{costItem.costItemNo}}</span>--<span>{{costItem.costItemName}}</span>--<span>{{costItem.costItemType}}</span>--<span>{{costItem.costItemPrice}}</span>
              </Option>
            </AutoComplete>
          </FormItem>
          <FormItem label="项目类型" prop="costType">
            <Input v-model="addForm.costType" ></Input>
          </FormItem>
          <FormItem label="规格" prop="costSpecifications">
            <Input v-model="addForm.costSpecifications"></Input>
          </FormItem>
          <FormItem label="剂量" prop="costDose">
            <Input v-model="addForm.costDose"></Input>
          </FormItem>
          <FormItem label="单价" prop="costPrice">
            <Input v-model="addForm.costPrice" />
          </FormItem>
          <FormItem label="单位" prop="costUnit">
            <Input v-model="addForm.costUnit" />
          </FormItem>
          <FormItem label="数量" prop="costNum">
            <Input v-model="addForm.costNum" />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="add()">录入</Button>
          <Button @click="cancelAdd()">取消</Button>
        </div>
      </Modal>

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
            title: '操作',
            slot: 'action',
            width: 120
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
        data: [],
        modal: false,
        deptList: [],
        costItemList: [],
        addForm: {
          costNo: '',
          costType: '',
          costName: '',
          costSpecifications: '',
          costPrice: '',
          costNum: '',
          costDose:'',
          costUnit: '',
          operator: '',
          admissionId: ''
        },
        deptNameSelective: '',
        pid: '',
        pname: '',
        admissionNumber: '',
        admissionOfDateStart: '',
        admissionOfDateEnd: '',
        total: 0,
        sid: '',
        ruleValidate: {
          costPrice: [{
              required: true,
              message: '单价不能为空',
              trigger: 'blur'
            },
            {
              pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
              message: '请输入数字',
              trigger: 'change'
            }
          ],
          costNum: [{
              required: true,
              message: '数量不能为空',
              trigger: 'blur'
            },
            {
              pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
              message: '请输入数字',
              trigger: 'blur'
            }
          ],
          costName:[{
            required: true,
            message: '名称不能为空',
            trigger: 'change'
          }],
          costUnit:[{
            required: true,
            message: '单位不能为空',
            trigger: 'change'
          }],
          costType:[{
            required: true,
            message: '类型不能为空',
            trigger: 'change'
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
      this.sid = JSON.parse(localStorage.getItem("TOKEN")).username;
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
            }else if (res.data.status === 500) {
            this.$Message.info(res.data.msg)
            } 
          })
          .catch(err => {
            console.log(err)
            this.$Message.info("服务器出错")
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
            }else if (res.data.status === 500) {
            this.$Message.info(res.data.msg)
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
            } else if (res.data.status === 500) {
              this.$Message.info("请输入正确的搜索条件")
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      getCostItem() {
        this.$http({
            url: 'costItem/getCostItem',
            method: 'GET',
            params: {
              costItemNo: this.addForm.costNo,
              costItemName: this.addForm.costName
            }
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.costItemList = res.data.data;
            }else if (res.data.status === 500) {
            this.$Message.info(res.data.msg)
            } 
          })
          .catch((err) => {
            console.log(err);
          });
      },
      initForm(value) {
        this.$http({
            url: 'costItem/getCostItemByNo',
            method: 'GET',
            params: {
              costItemNo: value
            }
          })
          .then(res => {
            if (res.data.status === 200) {
              this.costItemList = res.data.data;
              this.addForm.costNo = this.costItemList.costItemNo
              this.addForm.costType = this.costItemList.costItemType
              this.addForm.costName = this.costItemList.costItemName
              this.addForm.costPrice = this.costItemList.costItemPrice
              this.addForm.costSpecifications = this.costItemList.costItemSpecifications
              this.addForm.costUnit = this.costItemList.costItemUnit
              this.addForm.costDose = this.costItemList.costItemDose
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            this.$Message.error("服务器出错！")
          })
      },
      addCost(index) {
        this.addForm.admissionId = this.data[index].id
        this.addForm.operator = this.sid
        this.modal = true;
      },
      cancelAdd() {
        this.modal = false;
        this.$refs.add.resetFields()
      },
      add(){
        this.$refs.add.validate(valid=>{
          if (valid) {
              this.$http({
              url:'cost/addCost',
              method:'POST',
              data:this.addForm
            })
            .then((res) => {
              if (res.data.status === 200) {
                this.$Message.info(res.data.data)
                this.$refs.add.resetFields()
                this.modal = false;
              }else if (res.data.status === 500) {
                this.$Message.info(res.data.msg)
                this.$refs.add.resetFields()
                this.modal = false;      
              }
            })
            .catch((err) => {
              console.log(err);
              this.modal = false;
            });
          }
        })
      },
      clear(){
        this.$refs.add.resetFields()
      }
    }
  }

</script>
<style scoped>
  .page-box {
    margin-top: 10px;
  }
  .table-box{
    margin-top: 10px;
  }

</style>
