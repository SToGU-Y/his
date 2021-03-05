<template>
  <div id="patientCostQuery">
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
    <!-- 查询结果表格之类的 -->
    <div class="table-box">
      <Table height="540px" border :columns="columns" :data="data">
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" @click="queryCost(index)">费用明细</Button>
        </template>
      </Table>
       <Modal width="1400px" :mask-closable="false" :closable="false" v-model="modal" title="费用明细">
        <div style="background:#eee;padding:20px">
          <Card :bordered="false">
            <div id="cardItem">
              <DatePicker type="daterange" placement="bottom-end" placeholder="请选择录入时间"
                style="width: 200px;margin-right:5px"
                format="yyyy-MM-dd" @on-change="setTime"></DatePicker>
              <Button class="search-btn" type="primary" shape="circle" icon="ios-search" @click="query()"></Button>
            </div>
          </Card>
        </div>
        <div>
          <Button type="primary" v-print="printObj">打印</Button>
        </div>
        <Table max-height="500px" :columns="costColumns" style="overflow:scroll" :data="costList" show-summary :summary-method="handleSummary"></Table>
        <div slot="footer">
          <Button @click="close()">关闭</Button>
        </div>
      </Modal>

      <div style="display:none;">
        <div id="printMe">
            <div class="patientInformation">
              <h2>住院消费清单</h2>
              <Row>
                <Col span="6">
                  病人姓名:{{patient.pname}}
                </Col>
                <Col span="8">
                  身份证号:{{patient.pid}}
                </Col>
                <Col span="8">
                  住院号:{{patient.admissionNumber}}
                </Col>
              </Row>
              <Row>
                <Col span="4">
                  病人性质:{{patient.ptName}}
                </Col>
                <Col span="3">
                  年龄:{{patient.age}}
                </Col>
                <Col span="3">
                  性别:{{patient.sex}}
                </Col>
                <Col span="6">
                  入院科室:{{patient.deptName}}
                </Col>
                <Col span="6">
                  出生年月日:{{moment(patient.birth).format('YYYY-MM-DD')}}
                </Col>
              </Row>
              <Row>
                <Col span="4">
                  病房号:{{patient.iwardId}}
                </Col>
                <Col span="4">
                  床位号:{{patient.bid}}
                </Col>
                <Col span="6">
                  入院时间:{{moment(patient.dateOfAdmission).format('YYYY-MM-DD')}}
                </Col>
                <Col span="6">
                  住院天数:{{countDay(patient)}}
                </Col>
              </Row>
            </div>
            <table align="center" border="1" width="700px">
              <tr>
                <th>项目编号</th>
                <th>项目名称</th>
                <th>规格</th>
                <th>单价</th>
                <th>数量</th>
                <th>剂量</th>
                <th>单位</th>
                <th>费用时间</th>
                <th>总额</th>
              </tr>
              <tr v-for="(item,index) in costList" :key="index">
                <td>{{item.costNo}}</td>
                <td>{{item.costName}}</td>
                <td>{{item.costSpecifications}}</td>
                <td>{{item.costPrice}}</td>
                <td>{{item.costNum}}</td>
                <td>{{item.costDose}}</td>
                <td>{{item.costUnit}}</td>
                <td>{{moment(item.costDate).format('YYYY-MM-DD')}}</td>
                <td>{{item.costSum}}</td>
              </tr>
              <tr>
                <td colspan="8">总价</td>
                <td>{{countSum(costList)}}</td>
              </tr>
            </table>
        </div>
      </div>
    </div>
    <!-- 分页 -->
    <div class="page-box">
      <Page :total="total" show-elevator @on-change="pageChange" />
    </div>
  </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        columns: [
          {
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
            width: 150,
            render:(h,params) =>{
              if (params.row.status === 2) {
                return h('span',{},params.row.medicalNumber)
              }else{
                if (params.row.deposit < params.row.costSum) {
                  return h('span',{
                    style:{
                      color: 'red'
                    }
                  },params.row.medicalNumber)
                }else{
                  return h('span',{},params.row.medicalNumber)
                }
              }
            }
          },
          {
            title: '住院号',
            key: 'admissionNumber',
            width: 150,
            render:(h,params) =>{
              if (params.row.status === 2) {
                return h('span',{},params.row.admissionNumber)
              }else{
                if (params.row.deposit < params.row.costSum) {
                  return h('span',{
                    style:{
                      color: 'red'
                    }
                  },params.row.admissionNumber)
                }else{
                  return h('span',{},params.row.admissionNumber)
                }
              }
            }
          },
          {
            title: '身份证号',
            key: 'pid',
            width: 200,
            render:(h,params) =>{
              if (params.row.status === 2) {
                return h('span',{},params.row.pid)
              }else{
                if (params.row.deposit < params.row.costSum) {
                  return h('span',{
                    style:{
                      color: 'red'
                    }
                  },params.row.pid)
                }else{
                  return h('span',{},params.row.pid)
                }
              }
            }
          },
          {
            title: '姓名',
            key: 'pname',
            width: 150,
            render:(h,params) =>{
              if (params.row.status === 2) {
                return h('span',{},params.row.pname)
              }else{
                if (params.row.deposit < params.row.costSum) {
                  return h('span',{
                    style:{
                      color: 'red'
                    }
                  },params.row.pname)
                }else{
                  return h('span',{},params.row.pname)
                }
              }
            }
          },
          {
            title: '病人性质',
            key: 'ptName',
            width: 150,
            render:(h,params) =>{
              if (params.row.status === 2) {
                return h('span',{},params.row.ptName)
              }else{
                if (params.row.deposit < params.row.costSum) {
                  return h('span',{
                    style:{
                      color: 'red'
                    }
                  },params.row.ptName)
                }else{
                  return h('span',{},params.row.ptName)
                }
              }
            }
          },
          {
            title: '入住科室',
            key: 'deptName',
            width: 150,
            render:(h,params) =>{
              if (params.row.status === 2) {
                return h('span',{},params.row.deptName)
              }else{
                if (params.row.deposit < params.row.costSum) {
                  return h('span',{
                    style:{
                      color: 'red'
                    }
                  },params.row.deptName)
                }else{
                  return h('span',{},params.row.deptName)
                }
              }
            }
          },
          {
            title: '病房',
            key: 'iwardId',
            width: 100,
            render:(h,params) =>{
              if (params.row.status === 2) {
                return h('span',{},params.row.iwardId)
              }else{
                if (params.row.deposit < params.row.costSum) {
                  return h('span',{
                    style:{
                      color: 'red'
                    }
                  },params.row.iwardId)
                }else{
                  return h('span',{},params.row.iwardId)
                }
              }
            }
          },
          {
            title: '病床',
            key: 'bid',
            width: 100,
            render:(h,params) =>{
              if (params.row.status === 2) {
                return h('span',{},params.row.bid)
              }else{
                if (params.row.deposit < params.row.costSum) {
                  return h('span',{
                    style:{
                      color: 'red'
                    }
                  },params.row.bid)
                }else{
                  return h('span',{},params.row.bid)
                }
              }
            }
          },
          {
            title: '余额',
            key: 'deposit',
            width: 100,
            render:(h,params) =>{
              if (params.row.status === 2) {
                return h('span',{},params.row.deposit)
              }else{
                if (params.row.deposit < params.row.costSum) {
                  return h('span',{
                    style:{
                      color: 'red'
                    }
                  },params.row.deposit)
                }else{
                  return h('span',{},params.row.deposit)
                }
              }
            }
          },
          {
            title: '已花费',
            key: 'costSum',
            width: 100,
            render:(h,params) =>{
              if (params.row.status === 2) {
                return h('span',{},params.row.costSum)
              }else{
                if (params.row.deposit < params.row.costSum) {
                  return h('span',{
                    style:{
                      color: 'red'
                    }
                  },params.row.costSum)
                }else{
                  return h('span',{},params.row.costSum)
                }
              }
            }
          },
          {
            title: '性别',
            key: 'sex',
            width: 80,
            render:(h,params) =>{
              if (params.row.status === 2) {
                return h('span',{},params.row.sex)
              }else{
                if (params.row.deposit < params.row.costSum) {
                  return h('span',{
                    style:{
                      color: 'red'
                    }
                  },params.row.sex)
                }else{
                  return h('span',{},params.row.sex)
                }
              }
            }
          },
          {
            title: '年龄',
            key: 'age',
            width: 100,
            sortable: true,
            render:(h,params) =>{
              if (params.row.status === 2) {
                return h('span',{},params.row.age)
              }else{
                if (params.row.deposit < params.row.costSum) {
                  return h('span',{
                    style:{
                      color: 'red'
                    }
                  },params.row.age)
                }else{
                  return h('span',{},params.row.age)
                }
              }
            }
          },
          {
            title: '出生年月日',
            key: 'birth',
            width: 200,
            sortable: true,
            render:(h,params) =>{
              if (params.row.status === 2) {
                return h('div', this.moment(params.row.birth).format('YYYY-MM-DD HH:mm:ss'))
              }else{
                if (params.row.deposit < params.row.costSum) {
                  return h('div',{
                    style:{
                      color: 'red'
                    }
                  } ,this.moment(params.row.birth).format('YYYY-MM-DD HH:mm:ss'))
                }else{
                  return h('div', this.moment(params.row.birth).format('YYYY-MM-DD HH:mm:ss'))
                }   
              }        
            }
          },     
          {
            title: '户口地址',
            key: 'regAddr',
            width: 200,
            render:(h,params) =>{
              if (params.row.status === 2) {
                return h('span',{},params.row.regAddr)
              }else{
                if (params.row.deposit < params.row.costSum) {
                  return h('span',{
                    style:{
                      color: 'red'
                    }
                  },params.row.regAddr)
                }else{
                  return h('span',{},params.row.regAddr)
                }
              }
            }
          },
          {
            title: '联系电话',
            key: 'tel',
            width: 150,
            render:(h,params) =>{
              if (params.row.status === 2) {
                return h('span',{},params.row.tel)
              }else{
                if (params.row.deposit < params.row.costSum) {
                  return h('span',{
                    style:{
                      color: 'red'
                    }
                  },params.row.tel)
                }else{
                  return h('span',{},params.row.tel)
                }
              }
            }
          },
          {
            title: '住院状态',
            key: 'status',
            width: 150,
            render:(h,params) =>{
              if (params.row.status === 2) {
                return h('span',{},params.row.status === 0 ? '在院' : (params.row.status === 1 ? '待出院' : '出院'))
              }else{
                if (params.row.deposit < params.row.costSum) {
                  return h('span',{
                    style:{
                      color: 'red'
                    }
                  },params.row.status === 0 ? '在院' : (params.row.status === 1 ? '待出院' : '出院'))
                }else{
                  return h('span',{},params.row.status === 0 ? '在院' : (params.row.status === 1 ? '待出院' : '出院'))
                }
              }
            }
          },
          {
            title: '入院日期',
            key: 'dateOfAdmission',
            width: 200,
            sortable: true,
            render:(h,params) =>{
              if (params.row.status === 2) {
                return h('div', this.moment(params.row.dateOfAdmission).format('YYYY-MM-DD HH:mm:ss'))
              }else{
                if (params.row.deposit < params.row.costSum) {
                  return h('div',{
                    style:{
                      color: 'red'
                    }
                  } ,this.moment(params.row.dateOfAdmission).format('YYYY-MM-DD HH:mm:ss'))
                }else{
                  return h('div', this.moment(params.row.dateOfAdmission).format('YYYY-MM-DD HH:mm:ss'))
                }      
              }     
            }
          },
          {
            title: '出院日期',
            key: 'dateOfDischarge',
            width: 200,
            sortable: true,
            render:(h,params) =>{
              if (params.row.status === 2) {
                return h('div', params.row.dateOfDischarge === null ? '' : this.moment(params.row.dateOfDischarge).format('YYYY-MM-DD HH:mm:ss'))
              }else{
                if (params.row.deposit < params.row.costSum) {
                  return h('div',{
                    style:{
                      color: 'red'
                    }
                  } ,params.row.dateOfDischarge === null ? '' :this.moment(params.row.dateOfDischarge).format('YYYY-MM-DD HH:mm:ss'))
                }else{
                  return h('div', params.row.dateOfDischarge === null ? '' : this.moment(params.row.dateOfDischarge).format('YYYY-MM-DD HH:mm:ss'))
                }        
              }   
            }
          },
          {
            title: '住院天数',
            key: 'day',
            width: 150,
            render:(h,params) =>{
              if (params.row.status === 2) {
                return h('span',{},params.row.day)
              }else{
                if (params.row.deposit < params.row.costSum) {
                  return h('span',{
                    style:{
                      color: 'red'
                    }
                  },params.row.day)
                }else{
                  return h('span',{},params.row.day)
                }
              }
            }
          }
        ],
        data: [],
        costColumns: [
          {
            type: 'index',
            key:'index',
            width: 80,
            align: 'center'
          },
          {
            title: '项目编号',
            key: 'costNo'
          },
          {
            title: '项目名称',
            key: 'costName'
          },
          {
            title: '规格',
            key: 'costSpecifications'
          },
          {
            title: '单价',
            key: 'costPrice'
          },
          {
            title: '数量',
            key: 'costNum'
          },
          {
            title: '单位',
            key: 'costUnit'
          },
          {
            title: '录入日期',
            key: 'costDate',
            width: 200,
            sortable: true,
            render: (h, params) => {
              return h('div', this.moment(params.row.costDate).format('YYYY-MM-DD'))
            }
          },
          {
            title: '操作人',
            key: 'operator',
            width: 100
          },
          {
            title: '总额',
            key: 'costSum'
          }
        ],
        costColumns2: [
          {
            title: '项目编号',
            key: 'costNo',
            width: 100
          },
          {
            title: '项目名称',
            key: 'costName',
            width: 100
          },
          {
            title: '规格',
            key: 'costSpecifications',
            width: 100
          },
          {
            title: '单价',
            key: 'costPrice',
            width: 80
          },
          {
            title: '数量',
            key: 'costNum',
            width: 80
          },
          {
            title: '单位',
            key: 'costUnit',
            width: 100
          },
          {
            title: '录入日期',
            key: 'costDate',
            width: 200,
            sortable: true,
            render: (h, params) => {
              return h('div', this.moment(params.row.costDate).format('YYYY-MM-DD'))
            }
          },
          {
            title: '总额',
            key: 'costSum',
            width: 100
          }
        ],
        costList: [],
        total: 0,
        modal:false,
        totalDeposit:0,
        printObj:{
          id:'printMe',
          popTitle: '费用清单',
          extraHead: '<meta http-equiv="Content-Language" content="zh-ch"/>'
        },
        conditionForm:{
            admissionNumber:'',
            pid:''
        },
        conditionForm2:{
          admissionId: '',
          date1:'',
          date2:''
        },
        patient:{
          pname:'',
          pid:'',
          medicalNumber:'',
          admissionNumber:'',
          bid:'',
          iwardId:'',
          deptName:'',
          ptName:'',
          date1:'',
          date2:'',
          sex:'',
          age:'',
          birth:'',
          dateOfAdmission:''
        },
      }
    },

    methods: {
      getInpatientInformation() {
        this.$http({
            url: 'query/queryCost',
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
            url: 'query/queryCost',
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
              this.total = res.data.data.total
            } else if (res.data.status === 500) {
              this.$Message.info("请输入正确的搜索条件")
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      query(){
        this.$http({
            url: 'query/getCostByAdmissionId',
            method: 'GET',
            params: this.conditionForm2
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.costList = res.data.data
              this.modal = true
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      queryCost(index) {
        this.conditionForm2.admissionId = this.data[index].id
        this.$http({
            url: 'query/getCostByAdmissionId',
            method: 'GET',
            params: this.conditionForm2
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.patient = this.data[index];
              this.costList = res.data.data
              this.modal = true
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      close() {
        this.modal = false;
      },
      handleSummary({columns,data}) {
        const sums = {};
        columns.forEach((column, index) => {
          const key = column.key;
          if (index === 1) {
            sums[key] = {
              key,
              value: '总价'
            };
            return;
          }

          if (index === 9) {
            const values = data.map(item => Number(item[key]));
            if (!values.every(value => isNaN(value))) {
              const v = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              sums[key] = {
                key,
                value: v + ' 元'
              };
            } else {
              sums[key] = {
                key,
                value: 'N/A'
              };
            }
          } else {
            sums[key] = {
              key,
              value: ''
            };
            return
          }
        });


        return sums;
      },
      setTime(date){
        this.conditionForm2.date1 = date[0];
        this.conditionForm2.date2 = date[1];
      },
      countSum(value){
        var finalSum = 0;
        value.forEach(element => {
          finalSum = finalSum + element.costSum
        });
        return finalSum;
      },
      countDay(value){
        if (value.dateOfDischarge === null) {
          var stime =new Date(value.dateOfAdmission).getTime();
          var etime = new Date().getTime();
          var usedTime = etime - stime;  //两个时间戳相差的毫秒数
          var days=Math.floor(usedTime/(24*3600*1000));
          return days
        }else{
          var stime =new Date(value.dateOfAdmission).getTime();
          var etime = new Date(value.dateOfDischarge).getTime();
          var usedTime = etime - stime;  //两个时间戳相差的毫秒数
          var days=Math.floor(usedTime/(24*3600*1000));
          return days
        }
      }
  
    }
  }

</script>
<style scoped>
  .page-box {
    margin-top: 10px;
  }
</style>
