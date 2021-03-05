<style scoped>
  .page-box {
    margin-top: 10px;
  }

  #printMe h2{
    text-align: center;
  }

  .btn-box {
    margin: 5px;
    text-align: left;
  }

</style>
<template>
  <div id="bill">
    <!-- 查询组件 -->
    <div class="card-box" style="background:#eee;padding:20px">
      <Card :bordered="false">
        <div id="cardItem">
          <Input placeholder="请输入住院号" v-model="conditionForm.admissionNumber" clearable style="width: 200px;" />
          <Input placeholder="请输入收款人工号" v-model="conditionForm.operator" clearable style="width: 200px;" />
          <DatePicker type="daterange" placement="bottom-end" placeholder="请选择付款时间"
            style="width: 200px;margin-right:5px" format="yyyy-MM-dd" @on-change="setTime"></DatePicker>
          <Button class="search-btn" type="primary" shape="circle" icon="ios-search" @click="getBill()"></Button>
        </div>
      </Card>
    </div>
    <!-- 按钮 -->
    <div class="btn-box">
      <Button type="primary" v-print="printObj">打印</Button>
      <Button type="primary" @click="getBillReport">打印收费凭据</Button>
      <Button v-if="auth === 'ROLE_ADMIN'" type="error" @click="modal = true">删除</Button>
      <Button type="primary" @click="modal2 = true">报表生成</Button>
  
        <div style="display:none;">
          <div id="printMe">
            <h2>账单记录</h2>
            <table align="center" border="1" width="700px">
              <tr>
                <th>序号</th>
                <th>住院号</th>
                <th>账单号</th>
                <th>余额</th>
                <th>花费</th>
                <th>实付</th>
                <th>付款方式</th>
                <th>付款时间</th>
                <th>收款人</th>
              </tr>
              <tr v-for="(item,index) in selectiveList" :key="index">
                <td>{{index+1}}</td>
                <td>{{item.admissionNumber}}</td>
                <td>{{item.billId}}</td>
                <td>{{item.deposit}}</td>
                <td>{{item.costSum}}</td>
                <td>{{item.pay}}</td>
                <td>{{item.paymentType}}</td>
                <td>{{moment(item.date).format('YYYY-MM-DD')}}</td>
                <td>{{item.operator}}</td>
              </tr>
            </table>
          </div>
        </div>

      <Modal :mask-closable="false" :closable="false" v-model="modal" title="提示">
        是否删除所选账单？
        <div slot="footer">
          <Button type="error" @click="del()">是</Button>
          <Button @click="no()">否</Button>
        </div>
      </Modal>

      <Modal :mask-closable="false" :closable="false" v-model="modal2" title="生成报表">
        <div>
          <DatePicker confirm type="daterange" placement="bottom-end" placeholder="请选择报表时间"
            style="width: 200px;margin-right:5px" format="yyyy-MM-dd" @on-change="setTime2" @on-clear="clear">
          </DatePicker>
        </div>
        <div slot="footer">
          <Button type="error" @click="queryReport()">查看报表</Button>
          <Button @click="cancel()">取消</Button>
        </div>
      </Modal>
      <Modal width="800px" :mask-closable="false" :closable="false" v-model="modal3" title="报表">
        <div id="printMe2" style="text-align: center;">
        <h3>收款员住院费用结账报表</h3> <p style="float:right;">收款员:{{this.sid}}</p>
        <table align="center" border="1" width="750px">
          <tr>
            <th width="150px;">项目</th>
            <th width="150px;">金额</th>
            <th width="150px;">条数</th>
            <th width="150px;">支付方式</th>
            <th width="150px;">金额</th>
          </tr>
          <template  v-for="(item,index) in report">
            <tr v-for="(m,i) in item.list">
              <td v-if="i == 0" :rowspan="item.list.length">{{item.type}}</td>
              <td v-if="i == 0" :rowspan="item.list.length">{{item.sum}}</td>
              <td v-if="i == 0" :rowspan="item.list.length">{{item.number}}</td>
              <td>{{m.type}}</td>
              <td>{{m.sum}}</td>
            </tr>
          </template>
          <tr>   
            <td>总额</td>
            <td colspan="5" align="right"> {{ this.sum }} </td>
          </tr>
        </table>
        </div>
        <div slot="footer">
          <Button type="primary" v-print="printObj2">打印</Button>
          <Button @click=" close()">关闭</Button>
        </div>
      </Modal>
    </div>
    <!-- 表格 -->
    <div class="table-box">
      <Table @on-select-all-cancel="selectAllCancel" @on-select-all="selectAll"
        @on-select="advicesSelective" @on-select-cancel="cancelSelect" border :columns="columns" :data="data">
      </Table>

      <Modal width="800px" :mask-closable="false" :closable="false" v-model="modal4" title="凭据">
        <div id="printMe3" style="text-align:center;">
          <h2>住院收费凭据</h2>
          <table align="center" border="1" width="700px">
            <tr>
              <td width="60px">姓名</td>
              <td>{{patient.pname}}</td>
              <td width="80px">住院号</td>
              <td>{{patient.admissionNumber}}</td>
              <td width="60px">性别</td>
              <td>{{patient.sex}}</td>
            </tr>
            <tr>
              <td>年龄</td>
              <td>{{patient.age}}</td>
              <td >入院科室</td>
              <td>{{patient.deptName}}</td>
              <td>病人性质</td>
              <td>{{patient.ptName}}</td>
            </tr>
            <tr>
              <td>入院日期</td>
              <td>{{moment(patient.dateOfAdmission).format('YYYY-MM-DD HH:mm:ss')}}</td>
              <td>出院日期</td>
              <td>{{ moment(patient.dateOfDischarge).format('YYYY-MM-DD HH:mm:ss')}}</td>
              <td>账单号</td>
              <td>{{selective.billId}}</td>
            </tr>
            <tr>
              <td>押金</td>
              <td>{{selective.deposit}}</td>
              <td>花费</td>
              <td>{{selective.costSum}}</td>
              <td>应付</td>
              <td>{{selective.pay}}</td>
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
          <Button type="primary" v-print="printObj3">打印</Button>
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
            title: '账单号',
            key: 'billId',
            width: 150
          },
          {
            title: '住院号',
            key: 'admissionNumber',
            width:300
          },
          {
            title: '收款人',
            key: 'operator',
            width: 100,
          },
          {
            title: '余额',
            key: 'deposit',
            width: 100
          },
          {
            title: '住院花费',
            key: 'costSum',
            width: 100
          },
          {
            title: '实付',
            key: 'pay',
            width: 100
          },
          {
            title: '付款方式',
            key: 'paymentType',
            width: 320
          },
          {
            title: '付款时间',
            key: 'date',
            sortable: true,
            width: 320,
            render: (h, params) => {
              return h('div', params.row.date == null ? '' : this.moment(params.row.date).format(
                'YYYY-MM-DD HH:mm:ss'))
            }
          }
        ],
        data: [],
        modal: false,
        modal2: false,
        modal3: false,
        modal4: false,
        total: 0,
        auth: '',
        sid: '',
        conditionForm: {
          admissionNumber: '',
          payDateStart: '',
          payDateEnd: '',
          operator: ''
        },
        reportCondition:{
          dateStart:'',
          dateEnd:'',
          operator:''
        },
        sum:0,
        report:[],
        printObj: {
          id: 'printMe',
          popTitle: '出院账单',
          extraHead: '<meta http-equiv="Content-Language" content="zh-ch"/>'
        },
        printObj2: {
          id: 'printMe2',
          popTitle: '报表',
          extraHead: '<meta http-equiv="Content-Language" content="zh-ch"/>'
        },
        printObj3: {
          id: 'printMe3',
          popTitle: '收费凭据',
          extraHead: '<meta http-equiv="Content-Language" content="zh-ch"/>'
        },
        patient:{
          admissionNumber:'',
          name:'',
          sex:'',
          age:'',
          dateOfAdmission:'',
          deptName:'',
          ptName:'',
          dateOfDischarge:''
        },
        selective:{
          billId:'',
          pay:'',
          paymentType:'',
          costSum:'',
          deposit:'',
          operator:'',
          date:''
        },
        selectiveList: []
      }
    },

    created() {
      this.getBill()
      this.auth = JSON.parse(localStorage.getItem("TOKEN")).auth[0].authority;
      this.sid = JSON.parse(localStorage.getItem("TOKEN")).username;
      this.reportCondition.operator = JSON.parse(localStorage.getItem("TOKEN")).username;
      this.reportCondition.dateStart = new Date();
      this.reportCondition.dateEnd = new Date();
    }, 
    
    methods: {
      getBill() {
        this.$http({
            url: 'bill/getAllBill',
            method: 'GET',
            params: this.conditionForm
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.data = res.data.data.list;
              this.total = res.data.data.total
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      pageChange(pageNum) {
        this.$http({
            url: 'bill/getAllBill',
            method: 'GET',
            params: {
              admissionNumber: this.conditionForm.admissionNumber,
              operator: this.conditionForm.operator,
              payDateStart: this.conditionForm.payDateStart,
              payDateEnd: this.conditionForm.payDateEnd,
              pageNum: pageNum
            }
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.data = res.data.data.list;
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err);
            this.$Message.info("服务器出错")
          });
      },
      advicesSelective(selection, row) {
        this.selectiveList = selection
        this.selective = this.selectiveList[0]
      },
      cancelSelect(selection, row) {
        this.selectiveList = selection
        this.selective = {
          billId:'',
          pay:'',
          paymentType:'',
          costSum:'',
          deposit:'',
          operator:'',
          date:''
        }
      },
      selectAllCancel() {
        this.selectiveList = []
      },
      selectAll(selection) {
        this.selectiveList = selection
      },
      setTime(date) {
        this.conditionForm.payDateStart = date[0];
        this.conditionForm.payDateEnd = date[1];
      },
      del() {
        if (this.selectiveList.length === 0) {
          this.$Message.info("请先选择要操作的选项")
        } else {
          this.$http({
              url: 'bill/delBill',
              method: 'POST',
              data: this.selectiveList
            })
            .then((res) => {
              if (res.data.status === 200) {
                this.$Message.info(res.data.data)
                this.modal = false;
                this.getAllBill()
              } else if (res.data.status === 500) {
                this.$Message.info(res.data.msg)
                this.modal = false;
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }

      },
      no() {
        this.modal = false;
      },
      queryReport(){
        this.$http({
          url:'bill/getReport',
          method:'GET',
          params:this.reportCondition
        })
        .then((res) => {
          if (res.data.status === 200) {
            this.report = res.data.data
            this.modal3 = true;
            this.sum = Number(this.report[0].sum) + Number(this.report[1].sum)
          }else if (res.data.status === 500) {
            this.$Message.info(res.data.msg)
          }
        })
        .catch((err) => {
          console.log(err);  
        });
      },
      close(){
        this.modal3 = false;
      },
      close2(){
        this.modal4 = false;
      },
      cancel(){
        this.modal2 = false;
      },
      setTime2(date) {
        this.reportCondition.dateStart = date[0];
        this.reportCondition.dateEnd = date[1];
      },
      clear(){
        this.reportCondition.dateStart = new Date();
        this.reportCondition.dateEnd = new Date();
      },
      getBillReport(){
        if (this.selectiveList.length === 0) {
          this.$Message.info("请选择打印的账单")
        }else if (this.selectiveList.length > 1) {
          this.$Message.info("请不要选择多项")
        }else{
            this.$http({
              url:'bill/getBillReport',
              method:'GET',
              params:{
                admissionId: this.selectiveList[0].admissionId
              }
            })
            .then((res) => {
              if (res.data.status === 200) {
                this.patient = res.data.data;
                this.modal4 = true;
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
