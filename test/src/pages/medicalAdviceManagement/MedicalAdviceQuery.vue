<template>
  <div id="medicalAdviceQuery">
    <!-- 条件查询区域 -->
    <div id="select-box">
      <div style="background:#eee;padding:20px">
        <Card :bordered="false">
          <div id="cardItem">
            <Input v-model="conditionForm.admissionNumber" placeholder="请输入住院号" clearable
              style="width: 200px; margin-right:5px" />
            <Input v-model="conditionForm.name" placeholder="请输入病人姓名" clearable
              style="width: 200px; margin-right:5px" />
            <Select filterable clearable v-model="conditionForm.status" style="width:200px">
              <Option :value="0" :key="0">未发送</Option>
              <Option :value="1" :key="1">待审核</Option>
              <Option :value="2" :key="2">待执行</Option>
              <Option :value="3" :key="3">已执行</Option>
              <Option :value="4" :key="4">停止</Option>
              <Option :value="5" :key="5">拒绝</Option>
            </Select>
            <Select filterable clearable v-model="conditionForm.madvType" style="width:200px">
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
      <Button type="primary" @click="sent">发送</Button>
      <Button type="error" @click="delCheck">删除</Button>
      <Button type="error" @click="stop">停嘱</Button>

      <Modal :mask-closable="false" :closable="false" v-model="modal2" title="提示">
        此操作将无法恢复！您确定要删除吗？
        <div slot="footer">
          <Button type="primary" @click="del()">删除</Button>
          <Button @click="cancelDel()">取消</Button>
        </div>
      </Modal>
    </div>
    <!-- 表格区域 -->
    <div id="table-box">
      <Table @on-select-all-cancel="selectAllCancel" @on-select-all="selectAll" @on-select="advicesSelective" @on-select-cancel="cancelSelect"
        border :columns="columns" :data="data">
        <template slot-scope="{ row, index }" slot="action">
          <Button @click="showUpdate(index)">更改</Button>
        </template>
      </Table>
      <Modal width="500px" :mask-closable="false" :closable="false" v-model="modal" title="更改医嘱">
        <Form ref="update" label-colon=":" :rules="ruleValidate" :model="updateForm" label-position="right"
          :label-width="100">
          <Row>
            <Col span="12">
            <FormItem label="开始日期" prop="madvStartDate">
              <DatePicker format="yyyy年MM月dd日" v-model="updateForm.madvStartDate"></DatePicker>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="开始时间" prop="madvStartTime">
              <TimePicker format="HH:mm" confirm v-model="updateForm.madvStartTime"></TimePicker>
            </FormItem>
            </Col>
          </Row>
          <FormItem label="项目编号" prop="madvOperationNo">
            <AutoComplete v-model="updateForm.madvOperationNo" :data="costItemList" placeholder="请输入项目编号" clearable
              @on-search="getCostItem" @on-select="initForm" @on-clear="clear">
              <Option v-for="costItem in costItemList" :key="'no'+costItem.costItemNo" :value="costItem.costItemNo">
                <span>{{costItem.costItemNo}}</span>--<span>{{costItem.costItemName}}</span>--<span>{{costItem.costItemType}}</span>--<span>{{costItem.costItemPrice}}</span>
              </Option>
            </AutoComplete>
          </FormItem>
          <FormItem label="项目名" prop="madvOperation">
            <AutoComplete v-model="updateForm.madvOperation" :data="costItemList" placeholder="请输入项目名称" clearable
              @on-search="getCostItem" @on-select="initForm" @on-clear="clear">
              <Option v-for="costItem in costItemList" :key="'name'+costItem.costItemNo" :value="costItem.costItemNo">
                <span>{{costItem.costItemNo}}</span>--<span>{{costItem.costItemName}}</span>--<span>{{costItem.costItemType}}</span>--<span>{{costItem.costItemPrice}}</span>
              </Option>
            </AutoComplete>
          </FormItem>
          <FormItem label="项目类型" prop="madvOperationType">
            <Input v-model="updateForm.madvOperationType"></Input>
          </FormItem>
          <FormItem label="规格" prop="madvSpecifications">
            <Input v-model="updateForm.madvSpecifications"></Input>
          </FormItem>
          <FormItem label="剂量" prop="madvDose">
            <Input v-model="updateForm.madvDose" />
          </FormItem>
          <FormItem label="单位" prop="madvUnit">
            <Input v-model="updateForm.madvUnit" />
          </FormItem>
          <FormItem label="单价" prop="madvPrice">
            <Input v-model="updateForm.madvPrice" />
          </FormItem>
          <FormItem label="频次" prop="madvFrequency">
            <Input type="number" v-model="updateForm.madvFrequency" />
          </FormItem>
          <FormItem label="用法" prop="madvUsage">
            <Input v-model="updateForm.madvUsage" />
          </FormItem>
          <FormItem label="嘱托" prop="entrustment">
            <Input v-model="updateForm.entrustment" />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button @click="update">更改</Button>
          <Button @click="cancel">取消</Button>
        </div>
      </Modal>
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
            title: '操作',
            width: 100,
            render: (h, params) => {
              return h("Button", {
                domProps: {
                  innerText: '更改'
                },
                props: {
                  type: 'primary',
                  disabled: params.row.status === 0 ? false : (params.row.status === 5 ? false : true) 
                },
                on: {
                  click: () => {
                    this.showUpdate(params.index)
                  }
                }
              })
            },
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
        conditionForm: {
          status: '',
          name: '',
          admissionNumber: '',
          username: '',
          madvType: ''
        },
        costItemList: [],
        total: 0,
        modal: false,
        modal2: false,
        token: '',
        selectiveList: [],
        updateForm: {
          madvId: '',
          madvStartDate: '',
          madvStartTime: '',
          madvOperationNo: '',
          madvOperation: '',
          madvOperationType: '',
          madvSpecifications: '',
          madvPrice: '',
          madvUnit: '',
          madvDose: '',
          madvUsage: '',
          madvFrequency: '',
          entrustment: ''
        },
        ruleValidate: {
          madvOperationNo: [{
            required: true,
            message: '编号不能为空',
            trigger: 'blur'
          }],
          madvOperation: [{
            required: true,
            message: '项目名称不能为空',
            trigger: 'blur'
          }],
          madvOperationType: [{
            required: true,
            message: '项目类型不能为空',
            trigger: 'blur'
          }],
          madvPrice: [{
              required: true,
              message: '单价不能为空',
              trigger: 'blur'
            },
            {
              pattern: /^\d+(\.\d+)?$/,
              message: '请输入数字',
              trigger: 'blur'
            }],
            madvFrequency: [{
             required: true,
             message: '频次不能为空',
             trigger: 'blur' 
            },
            {
              pattern: /^\d+(\.\d+)?$/,
              message: '请输入数字',
              trigger: 'blur'
            }
            ]
        },
      }
    },
    created() {
      this.token = JSON.parse(localStorage.getItem("TOKEN")).token;
      this.conditionForm.username = JSON.parse(localStorage.getItem("TOKEN")).username;
      this.getMedicalAdvice()
    },

    methods: {
      getMedicalAdvice() {
        this.$http({
            url: 'advice/getAdviceByUsername',
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
            url: 'advice/getAdviceByUsername',
            method: 'GET',
            params: {
              status: this.conditionForm.status,
              name: this.conditionForm.name,
              admissionNumber: this.conditionForm.admissionNumber,
              username: this.conditionForm.username,
              madvType: this.conditionForm.madvType,
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
      sent() {
        if (this.selectiveList.length === 0) {
          this.$Message.info("请先选择要操作的医嘱")
        }else{
          this.$http({
            url:'advice/sentStatus',
            method:'POST',
            data:this.selectiveList
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.$Message.info(res.data.data)
              this.getMedicalAdvice()
            }else{
              this.$Message.info(res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err);
          });
        }
      },
      delCheck() {
        if (this.selectiveList.length === 0) {
          this.$Message.info("请先选择要操作的医嘱")
        }else{
          this.modal2 = true;
        }
      },
      del() {
        this.$http({
          url:'advice/deleteAdvice',
          method:'POST',
          data:this.selectiveList
        })
        .then((res) => {
          if (res.data.status === 200) {
            this.$Message.info(res.data.data)
            this.modal2 = false;
            this.getMedicalAdvice()
          }else{
            this.$Message.info(res.data.msg)
          }
        })
        .catch((err) => {
          console.log(err);
        });
      },
      cancelDel(){
        this.modal2 = false;
      },
      stop() {
        if (this.selectiveList.length === 0) {
          this.$Message.info("请先选择要操作的医嘱")
        }else{
          this.$http({
            url:'advice/stopStatus',
            method:'POST',
            data:{
              selectiveList:this.selectiveList,
              username:this.conditionForm.username
            }
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.$Message.info(res.data.data)
              this.getMedicalAdvice()
            }else{
              this.$Message.info(res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err); 
          });
        }
      },
      showUpdate(index) {
        this.modal = true;
        this.updateForm = {
          madvId: this.data[index].madvId,
          madvStartDate: this.data[index].madvStartDate,
          madvStartTime: this.data[index].madvStartTime,
          madvOperationNo: this.data[index].madvOperationNo,
          madvOperation: this.data[index].madvOperation,
          madvOperationType: this.data[index].madvOperationType,
          madvSpecifications: this.data[index].madvSpecifications,
          madvPrice: this.data[index].madvPrice,
          madvUnit: this.data[index].madvUnit,
          madvDose: this.data[index].madvDose,
          madvUsage: this.data[index].madvUsage,
          madvFrequency: this.data[index].madvFrequency,
          entrustment: this.data[index].entrustment
        }
      },
      update() {
        this.$refs.update.validate(valid=>{
          if (valid) {
            this.$http({
            url: 'advice/updateAdvice',
            method: 'POST',
            data: this.updateForm
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.$Message.info(res.data.data)
              this.modal = false;
              this.getMedicalAdvice()
            }else{
              this.$Message.info(res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err);
          });
          }
        })    
      },
      cancel() {
        this.modal = false;
        this.updateForm.madvId = ''
        this.$refs.update.resetFields()
      },
      getCostItem() {
        this.$http({
            url: 'costItem/getCostItem',
            method: 'GET',
            params: {
              costItemNo: this.updateForm.madvOperationNo,
              costItemName: this.updateForm.madvOperation
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
              this.updateForm.madvOperationNo = this.costItemList.costItemNo
              this.updateForm.madvOperationType = this.costItemList.costItemType
              this.updateForm.madvOperation = this.costItemList.costItemName
              this.updateForm.madvPrice = this.costItemList.costItemPrice
              this.updateForm.madvSpecifications = this.costItemList.costItemSpecifications
              this.updateForm.madvUnit = this.costItemList.costItemUnit
              this.updateForm.madvDose = this.costItemList.costItemDose
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            this.$Message.error("服务器出错！")
          })
      },
      clear(){
        this.updateForm.madvOperation= ''
        this.updateForm.madvOperationType=''
        this.updateForm. madvSpecifications=''
        this.updateForm. madvPrice=''
        this.updateForm.madvUnit= ''
        this.updateForm.madvDose= ''
        this.updateForm.madvUsage= ''
        this.updateForm.madvFrequency= ''
        this.updateForm.entrustment= ''
        this.updateForm.madvOperationNo = ''
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
