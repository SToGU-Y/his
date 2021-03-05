<style scoped>
  .page-box {
    margin-top: 10px;
  }
  #btn-box{
    text-align: left;
    margin: 5px;
  }

  #printMe h2{
    text-align: center;
  }

</style>
<template>
  <div id="depositAdd">
    <!-- 搜索条件组件 -->
    <div style="background:#eee;padding:20px">
      <Card :bordered="false">
        <div id="cardItem">
          <Select filterable clearable v-model="conditionForm.deptNameSelective" style="width:200px">
            <Option v-for="item in deptList" :value="item.deptName" :key="item.deptName">{{ item.deptName }}</Option>
          </Select>
          <Input v-model="conditionForm.admissionNumber" placeholder="请输入住院号" clearable style="width: 200px; margin-right:5px" />
          <Input v-model="conditionForm.pid"  placeholder="请输入身份证号" clearable style="width: 200px;margin-right:5px" />
          <Input v-model="conditionForm.pname"  placeholder="请输入病人姓名" clearable style="width: 200px;margin-right:5px" />
          <DatePicker type="daterange" placement="bottom-end" placeholder="请选择付款时间"
            style="width: 200px;margin-right:5px"
            format="yyyy-MM-dd" @on-change="setTime"></DatePicker>
          <Button class="search-btn" type="primary" shape="circle" icon="ios-search" @click="getInpatientInformation()"></Button>
        </div>
      </Card>
    </div>
    <div id="btn-box">
        <Button type="primary" v-print="printObj">打印</Button>
        <Button type="primary" @click="modal = true">预缴</Button>
        <Button type="primary" @click="printDeposit">打印收费凭据</Button>
        <Button type="error" @click="modal2 = true">删除</Button>
        
      <Modal :mask-closable="false" :closable="false" v-model="modal" title="费用预缴">
            <Form ref="pay" label-colon=":" :rules="ruleValidate" :model="payForm" label-position="right"
            :label-width="100">
            <FormItem label="住院号" prop="admissionNumber">
                <Input v-model="payForm.admissionNumber"/>
            </FormItem>
            <FormItem label="押金" prop="deposit">
                <Input v-model="payForm.deposit" />
            </FormItem>
            <FormItem label="付款方式" prop="paymentType">
                <Select v-model="payForm.paymentType">
                    <Option v-for="payment in paymentList" :key="payment.paymentType" :value="payment.paymentType">
                    {{payment.paymentType}}</Option>
                </Select>
            </FormItem>
            </Form>
        <div slot="footer">
          <Button type="primary" @click="addDeposit()">确定</Button>
          <Button @click="canceladd()">取消</Button>
        </div>
      </Modal>

      <Modal :mask-closable="false" :closable="false" v-model="modal2" title="提示">
        此操作无法恢复,请确认是否删除!
        <div slot="footer">
          <Button type="primary" @click="del()">删除</Button>
          <Button @click="canceldel()">取消</Button>
        </div>
      </Modal>
    </div>
    <!-- 查询结果表格之类的 -->
    <div class="table-box">
      <Table @on-select-all-cancel="selectAllCancel" @on-select-all="selectAll" @on-select="advicesSelective" 
      @on-select-cancel="cancelSelect" border :columns="columns" :data="data">
      </Table>
        <div style="display:none;">
          <div id="printMe">
            <h2>预缴金收款记录</h2>
            <table align="center" border="1" width="700px">
              <tr>
                <th>序号</th>
                <th>住院号</th>
                <th>押金单号</th>
                <th>姓名</th>
                <th>押金</th>
                <th>付款方式</th>
                <th>付款时间</th>
                <th>收款人</th>
              </tr>
              <tr v-for="(item,index) in selectiveList" :key="index">
                <td>{{index+1}}</td>
                <td>{{item.admissionNumber}}</td>
                <td>{{item.desId}}</td>
                <td>{{item.pname}}</td>
                <td>{{item.deposit}}</td>
                <td>{{item.paymentType}}</td>
                <td>{{moment(item.datePay).format('YYYY-MM-DD')}}</td>
                <td>{{item.operator}}</td>
              </tr>
            </table>
          </div>
        </div>
      <Modal width="800px" :mask-closable="false" :closable="false" v-model="modal3" title="凭据">
        <div id="printMe2" style="text-align:center;">
          <h2>住院收费凭据</h2>
          <table align="center" border="1" width="700px">
            <tr>
              <td width="60px">姓名</td>
              <td>{{selective.pname}}</td>
              <td width="80px">住院号</td>
              <td>{{selective.admissionNumber}}</td>
              <td width="60px">性别</td>
              <td>{{selective.sex}}</td>
            </tr>
            <tr>
              <td>年龄</td>
              <td>{{selective.age}}</td>
              <td >入院科室</td>
              <td>{{selective.deptName}}</td>
              <td>病人性质</td>
              <td>{{selective.ptName}}</td>
            </tr>
            <tr>
              <td>入院日期</td>
              <td>{{moment(selective.dateOfAdmission).format('YYYY-MM-DD HH:mm:ss')}}</td>
              <td>押金单号</td>
              <td>{{selective.desId}}</td>
              <td>押金</td>
              <td>{{selective.deposit}}</td>
            </tr>
            <tr>
              <td>收款人</td>
              <td>{{selective.operator}}</td>
              <td>收款方式</td>
              <td>{{selective.paymentType}}</td>
              <td>收款日期</td>
              <td>{{ moment(selective.date).format('YYYY-MM-DD HH:mm:ss')}}</td>
            </tr>
          </table>
        </div>
        <div slot="footer">
          <Button type="primary" v-print="printObj2">打印</Button>
          <Button @click="close2()">关闭</Button>
        </div>
      </Modal>
    </div>
    
    <!-- 分页 -->
    <div class="page-box">
      <Page :total="total" show-elevator @on-change="pageChange" />
    </div>

  </div>
</template>

<script>
  import PatientSelectCard from '@/components/select-card/PatientSelectCard'
  export default {
    data() {
      return {
        columns: [
           {
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
            title: '押金单号',
            key: 'desId',
            width: 200
          },
          {
            title: '姓名',
            key: 'pname',
            width: 150
          },
          {
            title: '押金金额',
            key: 'deposit',
            width: 100
          },
          {
            title: '押金状态',
            key: 'depositStatus',
            width: 100,
            render: (h, params) => {
              return h('div', [
                h('Badge', {
                  attrs: {
                    status: params.row.depositStatus == '1' ? 'success' : 'error'
                  }
                }),
                h('span', {
                  style: {
                    color: params.row.depositStatus == '1' ? '#19be6b' : 'red'
                  }
                }, params.row.depositStatus == '1' ? '已交' : '未交')
              ])
            }
          },
          {
            title: '付款方式',
            key: 'paymentType',
            width: 100
          },
          {
            title: '付款时间',
            key: 'datePay',
            width: 200,
            sortable: true,
            render: (h, params) => {
              return h('div', params.row.datePay == null ? '' : this.moment(params.row.datePay).format(
                'YYYY-MM-DD HH:mm:ss'))
            }
          },
          {
            title: '操作者',
            key: 'operator',
            width: 100
          },
          {
            title: '性别',
            key: 'sex',
            width: 80
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
            title: '入院日期',
            key: 'dateOfAdmission',
            width: 200,
            sortable: true,
            render: (h, params) => {
              return h('div', this.moment(params.row.dateOfAdmission).format('YYYY-MM-DD HH:mm:ss'))
            }
          }
        ],
        columns2: [
          {
            title: '住院号',
            key: 'admissionNumber',
            width: 120
          },
          {
            title: '押金单号',
            key: 'desId',
            width: 120
          },
          {
            title: '姓名',
            key: 'pname',
            width: 100,
            render:(h, params) => {
              return h('div', [
                h('span', {
                  style: {display: 'inline-block', 
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'},
                  domProps: {title: params.row.pname},
                  on:{click:(e) => { e.stopPropagation();}}
                }, params.row.pname)
              ]);
          }
          },
          {
            title: '押金金额',
            key: 'deposit',
            width: 100
          },
          {
            title: '付款时间',
            key: 'datePay',
            width: 180,
            render: (h, params) => {
              return h('div', params.row.datePay == null ? '' : this.moment(params.row.datePay).format(
                'YYYY-MM-DD HH:mm:ss'))
            }
          },
          {
            title: '操作者',
            key: 'operator',
            width: 90
          }
        ],
        data: [],
        modal: false,
        modal2: false,
        modal3: false,
        deptList: [],
        paymentList:[],
        conditionForm:{
          deptNameSelective: '',
          pid: '',
          pname: '',
          admissionNumber: '',
          payDateStart: '',
          payDateEnd: '',
        }, 
        total: 0,
        printObj:{
          id:'printMe',
          popTitle: '押金单记录',
          extraHead: '<meta http-equiv="Content-Language" content="zh-ch"/>'
        },
        printObj2: {
          id: 'printMe2',
          popTitle: '收费凭据',
          extraHead: '<meta http-equiv="Content-Language" content="zh-ch"/>'
        },
        payForm: {
          deposit: '',
          paymentType: '',
          admissionNumber:'',
          operator:''
        },
        selective:{
        },
        ruleValidate: {
            deposit:[
                {
                    required: true,message:'不能为空',
                    trigger: 'blur'
                },
                {
                    pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
                    message:'只能为数字',
                    trigger:'change'
                }
            ],
            paymentType: [{
                required: true,
                message: '不能为空',
                trigger: 'blur'}
            ],
            admissionNumber:[{
                required:true,
                message:'不能为空',
                trigger:'blur'
            }]
        },
        selectiveList:[]
      }
    },

    components: {
      PatientSelectCard
    },

    created() {
      this.getDept();
      this.getPayment();
      this.getInpatientInformation();
      this.payForm.operator = JSON.parse(localStorage.getItem("TOKEN")).username;
    },

    methods: {
      getPayment() {
        this.$http({
            url: 'common/getPayment',
            method: 'GET'
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.paymentList = res.data.data
            }else if (res.data.status === 500) {
            this.$Message.info(res.data.msg)
            } 
          })
          .catch((err) => {
            console.log(err);
          });
      },
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
      getInpatientInformation() {
        this.$http({
            url: 'register/getInformationWithDeposit',
            method: 'GET',
            params: {
              deptName: this.conditionForm.deptNameSelective,
              pid: this.conditionForm.pid,
              admissionNumber:this.conditionForm.admissionNumber,
              pname: this.conditionForm.pname,
              payDateStart: this.conditionForm.payDateStart,
              payDateEnd: this.conditionForm.payDateEnd
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
            url: 'register/getInformationWithDeposit',
            method: 'GET',
            params: {
              deptName: this.conditionForm.deptNameSelective,
              pid: this.conditionForm.pid,
              admissionNumber:this.conditionForm.admissionNumber,
              pname: this.conditionForm.pname,
              payDateStart: this.conditionForm.payDateStart,
              payDateEnd: this.conditionForm.payDateEnd,
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
      advicesSelective(selection, row) {
        this.selectiveList = selection
      },
      cancelSelect(selection, row) {
        this.selectiveList = selection
      },
      addDeposit(){
        this.$refs.pay.validate(valid => {
          if (valid) {
            this.$http({
                url:'deposit/addDeposit',
                method:'POST',
                data:this.payForm
            })
            .then((res) => {
                if (res.data.status === 200) {
                    this.$Message.info(res.data.data)
                    this.modal = false;
                    this.getInpatientInformation()
                }else if (res.data.status === 500) {
                    this.$Message.info(res.data.msg)
                }
            })
            .catch((err) => {
                console.log(err);
            });
          }else{
              this.$Message.info("请填写完整")
          }
        })
      },
      canceladd(){
          this.modal = false;
          this.$refs.pay.resetFields()
      },
      del(){
          this.$http({
              url:'deposit/delDeposit',
              method:'POST',
              data:this.selectiveList
          })
          .then((res) => {
            if (res.data.status === 200) {
                this.modal2 = false;
                this.$Message.info(res.data.data)
                this.selectiveList = []
                this.getInpatientInformation()
            }else if (res.data.status === 500) {
                this.$Message.info(res.data.msg)
            }
          })
          .catch((err) => {
              console.log(err);
          });
      },
      canceldel(){
        this.modal2 = false;
      },
      selectAllCancel(){
        this.selectiveList = []
      },
      selectAll(selection){
        this.selectiveList = selection
      },
      setTime(date){
        this.conditionForm.payDateStart = date[0];
        this.conditionForm.payDateEnd = date[1]
      },
      printDeposit(){
        if (this.selectiveList.length === 0) {
          this.$Message.info("请选择需要打印的选项")
        }else if (this.selectiveList.length > 1) {
          this.$Message.info("请选择单个打印的选项")
        }else{
          this.selective = this.selectiveList[0]
          this.modal3 = true;
        }
      },
      close2(){
        this.modal3 = false;
      }
    }
  }

</script>
