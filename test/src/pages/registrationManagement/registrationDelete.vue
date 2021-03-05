<template>
  <div id="registration">
    <!-- 搜索条件组件 -->
    <PatientSelectCard :deptList="deptList" @search="search"></PatientSelectCard>
    <!-- 查询结果表格之类的 -->
    <div class="table-box">
      <Table border :columns="columns" :data="data">
        <template slot-scope="{ row, index }" slot="action">
          <Button type="error" @click="del(index)">取消入院</Button>
        </template>
      </Table>
      <Modal :mask-closable="false" :closable="false" v-model="modal" title="提示">
        此操作将无法恢复！您确定要取消该入院登记吗？
        <div slot="footer">
          <Button type="primary" @click="deleteRegister()">确定</Button>
          <Button @click="cancel()">取消</Button>
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
        deptList: [],
        deptNameSelective: '',
        pid: '',
        pname: '',
        admissionNumber: '',
        admissionOfDateStart: '',
        admissionOfDateEnd: '',
        total: 0,
        admissionId:'',
        token: '',
        sid: '',
      }
    },
    components: {
      PatientSelectCard
    },
    created() {
      this.getCommon();
      this.getInpatientInformation();
      this.token = JSON.parse(localStorage.getItem("TOKEN")).token;
      this.sid = JSON.parse(localStorage.getItem("TOKEN")).username;
    },
    methods: {
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
              this.pageNum = pageNum
            } else if (res.data.status === 500) {
              this.$Message.info("请输入正确的搜索条件")
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      del(index) {
        this.admissionId = this.data[index].id;
        this.modal = true;
      },
      deleteRegister() {
        this.$http({
            url: 'register/deleteRegister',
            method: 'DELETE',
            params: {
              admissionId:this.admissionId
            }
          })
          .then((res) => {
            if (res.data.status === 200) {
                this.$Message.info(res.data.data)
                this.modal = false;
                this.admissionId = ''
                this.getInpatientInformation()
            }else if (res.data.status === 500) {
                this.$Message.info(res.data.msg)
                this.modal = false;
                this.admissionId = ''
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      cancel(){
        this.modal = false;
        this.admissionId = '';
      }
    }
  }

</script>
<style scoped>
  .table-box{
    margin-top: 10px;
  }

  .page-box {
    margin-top: 10px;
  }

</style>
