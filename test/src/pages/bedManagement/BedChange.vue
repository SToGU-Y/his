<style scoped>
  .search-btn {
    margin-left: 10px;
  }
  
  #select-box{
    margin-bottom: 10px;
  }

  #page-box {
    text-align: center;
    margin-top: 10px;
  }

</style>
<template>
  <div id="bedChange">
    <!-- 条件查询区域 -->
    <div id="select-box">
      <div style="background:#eee;padding:20px">
        <Card :bordered="false">
          <div id="cardItem">
            <Select filterable clearable v-model="deptIdSelective" style="width:200px">
              <Option v-for="item in deptList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
            </Select>
            <Select filterable clearable v-model="iwtId" style="width:200px" label="病房类型">
              <Option v-for="item in wardTypeList" :value="item.iwtId" :key="item.iwtId">{{ item.iwtType }}</Option>
            </Select>
            <Button class="search-btn" type="primary" shape="circle" icon="ios-search" @click="getNullBed()"></Button>
          </div>
        </Card>
      </div>

      <Modal :mask-closable="false" :closable="false" width="1000px" v-model="modal" title="选择病人">
        <div style="background:#eee;padding:20px">
          <Card :bordered="false">
            <div id="cardItem">
              <Form ref="patient" v-model="selectForm" inline>
                <FormItem prop="pid">
                  <Input clearable v-model="selectForm.pid" placeholder="请输入身份证号" />
                </FormItem>
                <FormItem prop="admissionNumber">
                  <Input clearable v-model="selectForm.admissionNumber" placeholder="请输入住院号" />
                </FormItem>
                <FormItem prop="pname">
                  <Input clearable v-model="selectForm.pname" placeholder="请输入姓名" />
                </FormItem>
                <Button class="search-btn" type="primary" shape="circle" icon="ios-search"
                  @click="getInformation()"></Button>
              </Form>
            </div>
          </Card>
        </div>
        <Table :columns="patient_columns" :data="patientList"></Table>
        <div id="page-box">
          <Page :total="total2" :page-size="9" @on-change="pageChange2"></Page>
        </div>
        <div slot="footer">
          <Button type="primary" @click="changeBed">选择</Button>
          <Button @click="cancelChange">取消</Button>
        </div>
      </Modal>
    </div>
    <!-- 表格区域 -->
    <Table border :columns="columns" :data="data">
    </Table>
    <!-- 分页区域 -->
    <div id="page-box">
      <Page :total="total" show-elevator @on-change="pageChange" :page-size="12" />
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        columns: [{
            title: '操作',
            render: (h, params) => {
              return h("Button", {
                domProps: {
                  innerText: '更换'
                },
                props: {
                  type: 'primary',
                },
                on: {
                  click: () => {
                    this.select(params)
                  }
                }
              })
            },
            align: 'center'
          },
          {
            title: '所在科室',
            key: 'deptName'
          },
          {
            title: '病房号',
            key: 'wardId'

          },
          {
            title: '病房类型',
            key: 'iwtType'
          },
          {
            title: '床位号',
            key: 'bid'
          },
          {
            title: '床位状态',
            key: 'bedStatus',
            render: (h, params) => {
              return h('div', [
                h('Badge', {
                  attrs: {
                    status: params.row.bedStatus == '1' ? 'error' : 'success'
                  }
                }),
                h('span', {
                  style: {
                    color: params.row.bedStatus == '1' ? 'red' : '#19be6b'
                  }
                }, params.row.bedStatus == '1' ? '已满' : '未满')
              ])
            }
          },
          {
            title: '病房可住人数',
            key: 'wardBedNum'
          },
          {
            title: '病房价格(元/晚)',
            key: 'iwtPrice'
          }
        ],
        patient_columns: [{
            title: '选择',
            key: 'id',
            width: 70,
            align: 'center',
            render: (h, params) => {
              let id = params.row.inpatientId;
              let oldid = params.row.id;
              let oldwid = params.row.wid;
              let flag = false;
              if (this.selectPatient.inpatientId === id) {
                flag = true
              } else {
                flag = false
              }
              return h('div', [
                h('Radio', {
                  props: {
                    value: flag
                  },
                  on: {
                    'on-change': () => {
                      this.selectPatient.inpatientId = id;
                      this.selectPatient.oldid = oldid;
                      this.selectPatient.oldwid = oldwid;
                    }
                  }
                })
              ])
            }
          },
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '住院号',
            key: 'admissionNumber'
          },
          {
            title: '姓名',
            key: 'pname'
          },
          {
            title: '身份证号',
            width: 200,
            key: 'pid'
          },
          {
            title: '病房号',
            key: 'wardId'
          },
          {
            title: '病床号',
            key: 'bid'
          }
        ],
        data: [],
        iwtId: '',
        deptIdSelective: '',
        deptList: [],
        wardTypeList: [],
        total: 0,
        total2: 0,
        modal: false,
        selectForm: {
          pid: '',
          admissionNumber: '',
          pname: '',
          deptName: ''
        },
        patientList: [],
        selectPatient: {
          wid: '', //病房主键
          id: '', //病床主键
          inpatientId: '', //住院记录主键
          oldid: '',
          oldwid: ''
        }
      }
    },

    created() {
      this.getDept();
      this.getType();
      this.getNullBed();
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
      getType() {
        this.$http({
            url: 'ward/getType',
            method: 'GET'
          })
          .then(res => {
            if (res.data.status === 200) {
              this.wardTypeList = res.data.data
            }else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            this.$Message.info("服务器出错")
            console.log(err)
          })
      },
      getNullBed() {
        this.$http({
            url: 'bed/getNullBed',
            method: 'GET',
            params: {
              iwtId: this.iwtId,
              deptId: this.deptIdSelective
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
            console.log(err)
          })
      },
      pageChange(pageNum) {
        this.$http({
            url: 'bed/getNullBed',
            method: 'GET',
            params: {
              iwtId: this.iwtId,
              deptId: this.deptIdSelective,
              pageNum: pageNum
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
            console.log(err)
          })
      },
      select(params) {
        this.modal = true
        this.selectForm.deptName = params.row.deptName
        this.selectPatient.wid = params.row.wid
        this.selectPatient.id = params.row.id
        this.$http({
            url: 'register/getInformationByDept2',
            method: 'GET',
            params: {
              deptName: params.row.deptName
            }
          })
          .then(res => {
            if (res.data.status === 200) {
              this.patientList = res.data.data.list
              this.total2 = res.data.data.total
            }else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err)
          })

      },
      getInformation() {
        this.$http({
            url: 'register/getInformationByDept2',
            method: 'GET',
            params: this.selectForm
          })
          .then(res => {
            if (res.data.status === 200) {
              this.patientList = res.data.data.list
              this.total2 = res.data.data.total
            }else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      cancelChange() {
        this.modal = false;
        this.selectForm = {
          pid: '',
          admissionNumber: '',
          pname: '',
          deptName: ''
        }
        this.selectPatient = {
          id: '',
          wid: '',
          inpatientId: '',
          oldid: '',
          oldwid: ''
        }
      },
      pageChange2(pageNum) {
        this.$http({
            url: 'register/getInformationByDept2',
            method: 'GET',
            params: {
              pid: this.selectForm.pid,
              admissionNumber: this.selectForm.admissionNumber,
              pname: this.selectForm.pname,
              deptName: this.selectForm.deptName,
              pageNum: pageNum
            }
          })
          .then(res => {
            if (res.data.status === 200) {
              this.patientList = res.data.data.list
              this.total2 = res.data.data.total
            }else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      changeBed() {
        this.$http({
            url: 'bed/changeBed',
            method: 'POST',
            data: this.selectPatient
          })
          .then(res => {
            if (res.data.status === 200) {
              this.modal = false;
              this.selectForm = {
                pid: '',
                admissionNumber: '',
                pname: '',
                deptName: ''
              }
              this.selectPatient = {
                id: '',
                wid: '',
                inpatientId: '',
                oldid: '',
                oldwid: ''
              }
              this.$Message.info(res.data.data)
              this.getNullBed()
            }else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err)
          })
      }

    }
  }

</script>
