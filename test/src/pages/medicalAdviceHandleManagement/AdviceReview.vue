<template>
  <div id="adviceReview">
    <!-- 条件查询区域 -->
    <div id="select-box">
      <div style="background:#eee;padding:20px">
        <Card :bordered="false">
          <div id="cardItem">
            <Select filterable clearable v-model="conditionForm.deptName" style="width:150px">
              <Option v-for="item in deptList" :value="item.deptName" :key="item.deptName">{{ item.deptName }}</Option>
            </Select>
            <Input v-model="conditionForm.admissionNumber" placeholder="请输入住院号" clearable
              style="width: 150px; margin-right:5px" />
            <Input v-model="conditionForm.name" placeholder="请输入病患名" clearable
              style="width: 150px; margin-right:5px" />
            <Input v-model="conditionForm.username" placeholder="请输入工号" clearable style="width: 150px; margin-right: 5px"/>
            <DatePicker type="daterange" placement="bottom-end" placeholder="请选择发送时间"
            style="width: 200px;margin-right:5px"
            format="yyyy-MM-dd" @on-change="setTime"></DatePicker>
            <Select filterable clearable v-model="conditionForm.madvType" style="width:150px">
              <Option :value="'长期医嘱'" :key="'长期医嘱'">长期医嘱</Option>
              <Option :value="'临时医嘱'" :key="'临时医嘱'">临时医嘱</Option>
            </Select>
            <Button class="search-btn" type="primary" shape="circle" icon="ios-search"
              @click="getMedicalAdvice"></Button>
          </div>
        </Card>
      </div>
    </div>
    <div id="btn-box">
      <Button type="primary" @click="pass">通过</Button>
      <Button type="error" @click="rejectCheck">拒绝</Button>
      <Modal :mask-closable="false" :closable="false" v-model="modal" title="提示">
        此操作将无法恢复！您确定要拒绝吗？
        <Form  label-colon=":" label-position="right" :label-width="100">
          <FormItem label="备注">
            <Input type="textarea" :row="3" v-model="remarks"/>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="error" @click="reject()">拒绝</Button>
          <Button @click="cancelReject()">取消</Button>
        </div>
      </Modal>
    </div>
    <!-- 表格区域 -->
    <div id="table-box">
      <Table  @on-select-all-cancel="selectAllCancel" @on-select-all="selectAll" @on-select="advicesSelective" @on-select-cancel="cancelSelect"
        border :columns="columns" :data="data">
        <template slot-scope="{ row, index }" slot="action">
          <Button @click="showUpdate(index)">更改</Button>
        </template>
      </Table>
    </div>
    <!-- 分页区域 -->
    <div id="page-box">
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
            title: '住院号',
            key: 'admissionNumber',
            width: 150
          },
          {
            title: '姓名',
            key: 'name',
            width: 100
          },
          {
            title: '入住科室',
            key: 'deptName2',
            width: 150
          },
          {
            title:'开嘱科室',
            key:'deptName',
            width: 150
          },
          {
            title: '病房号',
            key: 'wardId',
            width: 80
          },
          {
            title: '病床号',
            key: 'bid',
            width: 80
          },
          {
            title: '开始时间',
            align: 'center',
            children: [{
                title: '开始日期',
                key: 'madvStartDate',
                align: 'center',
                width: 200,
                sortable: true,
                render: (h, params) => {
                  return h('div', this.moment(params.row.madvStartDate).format('YYYY-MM-DD'))
                }
              },
              {
                title: '开始时间',
                key: 'madvStartTime',
                align: 'center',
                width: 200
              }
            ]
          },
          {
            title: '项目编号',
            key: 'madvOperationNo',
            width: 150
          },
          {
            title: '项目名称',
            key: 'madvOperation',
            width: 200
          },
          {
            title: '项目类型',
            key: 'madvOperationType',
            width: 100
          },
          {
            title: '规格',
            key: 'madvSpecifications',
            width: 100
          },
          {
            title: '剂量',
            key: 'madvDose',
            width: 100
          },
          {
            title: '单位',
            key: 'madvUnit',
            width: 80
          },
          {
            title: '单价',
            key: 'madvPrice',
            width: 100
          },
          {
            title: '频次',
            key: 'madvFrequency',
            width: 120,
            render: (h, params) => {
              if (params.row.madvFrequency === 1) {
                return h('div','每天一次')
              }else if (params.row.madvFrequency === 2) {
                return h('div','每天二次')
              }else if (params.row.madvFrequency === 3) {
                return h('div','每天三次')
              }else if (params.row.madvFrequency === 4) {
                return h('div','每六小时一次')
              }else if (params.row.madvFrequency === 12) {
                return h('div','每两小时一次')
              }else if (params.row.madvFrequency === 24) {
                return h('div','每小时一次')
              }
            }
          },
          {
            title: '用法',
            key: 'madvUsage',
            width: 150
          },
          {
            title: '嘱托',
            key: 'entrustment',
            width: 150
          },
          {
            title: '医嘱类型',
            key: 'madvType',
            width: 100
          },
          {
            title: '状态',
            key: 'status',
            width: 100,
            render: (h, params) => {
              if (params.row.status === 0) {
                return h('div', [
                  h('Badge', {
                    attrs: {
                      color: 'purple'
                    }
                  }),
                  h('span', {
                    style: {
                      color: 'purple'
                    }
                  }, '未发送')
                ])
              } else if (params.row.status === 1) {
                return h('div', [
                  h('Badge', {
                    attrs: {
                      color: 'orange'
                    }
                  }),
                  h('span', {
                    style: {
                      color: 'orange'
                    }
                  }, '待审核')
                ])
              } else if (params.row.status === 2) {
                return h('div', [
                  h('Badge', {
                    attrs: {
                      status: 'processing'
                    }
                  }),
                  h('span', {
                    style: {
                      color: 'blue'
                    }
                  }, '待执行')
                ])
              } else if (params.row.status === 3) {
                return h('div', [
                  h('Badge', {
                    attrs: {
                      status: 'success'
                    }
                  }),
                  h('span', {
                    style: {
                      color: 'lime'
                    }
                  }, '已执行')
                ])
              } else if (params.row.status === 4) {
                return h('div', [
                  h('Badge', {
                    attrs: {
                      status: 'error'
                    }
                  }),
                  h('span', {
                    style: {
                      color: 'red'
                    }
                  }, '停止')
                ])
              } else if (params.row.status === 5) {
                return h('div', [
                  h('Badge', {
                    attrs: {
                      color: 'magenta'
                    }
                  }),
                  h('span', {
                    style: {
                      color: 'magenta'
                    }
                  }, '拒绝')
                ])
              }
            }
          },
          {
            title: '开嘱医生',
            key: 'madvDoctor',
            width: 100
          },
          {
            title: '备注',
            key: 'remarks',
            width: 100
          },
          {
            title: '审核护士',
            key: 'madvNurse',
            width: 100
          },
          {
            title: '执行护士',
            key: 'madvExecuteNurse',
            width: 100
          },
          {
            title: '停嘱医生',
            key: 'madvEndDoctor',
            width: 100
          },
          {
            title: '结束时间',
            align: 'center',
            children: [{
                title: '结束日期',
                key: 'madvEndDate',
                align: 'center',
                width: 200,
                sortable: true,
                render: (h, params) => {
                  return h('div', params.row.madvEndDate == null ? '' : this.moment(params.row.madvEndDate)
                    .format('YYYY-MM-DD'))
                }
              },
              {
                title: '结束时间',
                key: 'madvEndTime',
                align: 'center',
                width: 200,
                render: (h, params) => {
                  return h('div', params.row.madvEndDate == null ? '' : this.moment(params.row.madvEndDate)
                    .format('HH:mm'))
                }
              }
            ]
          },
          {
            title: '发送时间',
            key: 'madvSentTime',
            width: 200,
            render: (h, params) => {
              return h('div', params.row.madvSentTime == null ? '' : this.moment(params.row.madvSentTime)
                .format('YYYY-MM-DD HH:mm'))
            }
          }
        ],
        data: [],
        deptList:[],
        conditionForm: {
          madvSentTimeFrom: '',
          madvSentTimeTo:'',
          name: '',
          admissionNumber: '',
          username: '',
          madvType: '',
          deptName:''
        },
        total: 0,
        modal: false,
        selectiveList: [],
        username:'',
        remarks:''
      }
    },
    created() {
      this.username = JSON.parse(localStorage.getItem("TOKEN")).username;
      this.getMedicalAdvice()
      this.getDept()
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
      getMedicalAdvice() {
        this.$http({
            url: 'advice/getAllAdvice',
            method: 'GET',
            params: this.conditionForm
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.data = res.data.data.list;
              this.total = res.data.data.total;
            }else if (res.data.status === 500) {
            this.$Message.info(res.data.msg)
            } 
          })
          .catch((err) => {
            console.log(err);
          });
      },
      pageChange(pageNum) {
        this.$http({
            url: 'advice/getAllAdvice',
            method: 'GET',
            params: {
              deptName: this.conditionForm.deptName,
              name: this.conditionForm.name,
              admissionNumber: this.conditionForm.admissionNumber,
              username: this.conditionForm.username,
              madvType: this.conditionForm.madvType,
              madvSentTimeFrom:this.conditionForm.madvSentTimeFrom,
              madvSentTimeTo:this.conditionForm.madvSentTimeTo,
              pageNum: pageNum
            }
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.data = res.data.data.list;
            }else if (res.data.status === 500) {
            this.$Message.info(res.data.msg)
            } 
          })
          .catch((err) => {
            console.log(err);
          });
      },
      advicesSelective(selection, row) {
        this.selectiveList = selection
      },
      cancelSelect(selection, row) {
        this.selectiveList = selection
      },
      pass() {
        if (this.selectiveList.length === 0) {
          this.$Message.info("请先选择要操作的选项")
        }else{
          this.$http({
            url:'advice/passStatus',
            method:'POST',
            data:{
              selectiveList: this.selectiveList,
              username:this.username
            }
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.$Message.info(res.data.data)
              this.getMedicalAdvice()
            }else if (res.data.status === 500) {
            this.$Message.info(res.data.msg)
            } 
          })
          .catch((err) => {
            console.log(err);
          });
        }
      },
      rejectCheck() {
        if (this.selectiveList.length === 0) {
          this.$Message.info("请先选择要操作的选项")
        }else{
          this.modal = true;
        }
      },
      reject() {
        this.$http({
          url:'advice/rejectStatus',
          method:'POST',
          data:{
            selectiveList: this.selectiveList,
            username: this.username,
            remarks: this.remarks
          }
        })
        .then((res) => {
          if (res.data.status === 200) {
            this.$Message.info(res.data.data)
            this.modal = false;
            this.remarks = ''
            this.getMedicalAdvice()
          }else if (res.data.status === 500) {
            this.$Message.info(res.data.msg)
            } 
        })
        .catch((err) => {
          console.log(err);
        });
      },
      cancelReject(){
        this.modal = false;
        this.remarks = '';
      },
      setTime(date){
        this.conditionForm.madvSentTimeFrom = date[0];
        this.conditionForm.madvSentTimeTo = date[1];
      },
      selectAllCancel(){
        this.selectiveList = []
      },
      selectAll(selection){
        this.selectiveList = selection
      }
    }
  }

</script>
<style scoped>
  #page-box {
    margin-top: 10px;
  }

  #btn-box {
    text-align: left;
    margin: 5px;
  }

</style>
