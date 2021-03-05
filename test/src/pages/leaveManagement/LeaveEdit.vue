<template>
  <div id="leaveEdit">
    <!-- 搜索条件组件 -->
    <div style="background:#eee;padding:20px">
      <Card :bordered="false">
        <div id="cardItem">
          <Select filterable clearable v-model="deptNameSelective" style="width:200px">
            <Option v-for="item in deptList" :value="item.deptName" :key="item.deptName">{{ item.deptName }}</Option>
          </Select>
          <Input v-model="admissionNumber" placeholder="请输入住院号" clearable style="width: 200px; margin-right:5px" />
          <Input v-model="pid" placeholder="请输入身份证号" clearable style="width: 200px;margin-right:5px" />
          <Input v-model="pname" placeholder="请输入病人姓名" clearable style="width: 200px;margin-right:5px" />
          <DatePicker type="daterange" placement="bottom-end" placeholder="请选择出院时间"
            style="width: 200px;margin-right:5px" format="yyyy-MM-dd" @on-change="setTime"></DatePicker>
          <Button class="search-btn" type="primary" shape="circle" icon="ios-search"
            @click="getInpatientInformation()"></Button>
        </div>
      </Card>
    </div>
    <div class="btn-box">
      <Button type="error" @click="check()">删除记录</Button>
      <Modal :mask-closable="false" :closable="false" v-model="modal" title="提示">
        是否删除所选出院记录?
        <div slot="footer">
          <Button type="error" @click="del()">是</Button>
          <Button @click="no()">否</Button>
        </div>
      </Modal>
    </div>
    <!-- 查询结果表格之类的 -->
    <div class="table-box">
      <Table @on-select-all-cancel="selectAllCancel" @on-select-all="selectAll"
        @on-select="advicesSelective" @on-select-cancel="cancelSelect" border :columns="columns" :data="data">
      </Table>
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
          },
          {
            title: '住院天数',
            key: 'day',
            width: 100
          },
          {
            title: '出院日期',
            key: 'dateOfDischarge',
            width: 200,
            render: (h, params) => {
              return h('div', this.moment(params.row.dateOfDischarge).format('YYYY-MM-DD HH:mm:ss'))
            }
          }
        ],
        data: [],
        deptList: [],
        selectiveList: [],
        modal: false,
        modal2: false,
        deptNameSelective: '',
        pid: '',
        pname: '',
        admissionNumber: '',
        admissionOfDateStart: '',
        admissionOfDateEnd: '',
        total: 0,
        sid: ''
      }
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
            } else if (res.data.status === 500) {
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
            url: 'register/getLeaveAdmission',
            method: 'GET',
            params: {
              deptName: this.deptNameSelective,
              pid: this.pid,
              admissionNumber:this.admissionNumber,
              pname: this.pname,
              admissionOfDateStart: this.admissionOfDateStart,
              admissionOfDateEnd: this.admissionOfDateEnd
            }
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
            url: 'register/getLeaveAdmission',
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
      setTime(date) {
        this.admissionOfDateStart = date[0];
        this.admissionOfDateEnd = date[1];
      },
      advicesSelective(selection, row) {
        this.selectiveList = selection
      },
      cancelSelect(selection, row) {
        this.selectiveList = selection
      },
      selectAllCancel() {
        this.selectiveList = []
      },
      selectAll(selection) {
        this.selectiveList = selection
      },
      del() {
        this.$http({
            url: 'register/delLeaveAdmission',
            method: 'POST',
            data: this.selectiveList
          })
          .then((res) => {
            if (res.data.status) {
              this.$Message.info(res.data.data)
              this.modal = false;
              this.getInpatientInformation()
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
              this.modal = false;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      no() {
        this.modal = false;
      },
      check() {
        if (this.selectiveList.length === 0) {
          this.$Message.info("请先选择要操作的选项")
        } else {
          this.modal = true;
        }
      }

    }
  }

</script>
<style scoped>
  #cardItem {
    text-align: center;
  }

  #cardItem input {
    margin-right: 5px;
  }

  .btn-box {
    text-align: left;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .page-box {
    margin-top: 10px;
  }

</style>
