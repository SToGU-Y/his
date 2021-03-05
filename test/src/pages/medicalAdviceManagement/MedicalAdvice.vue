<template>
  <div id="medicalAdvice">
    <!-- 条件筛选模块 -->
    <PatientSelectCard :deptList="deptList" @search="search"></PatientSelectCard>
    <!-- 表格区域 -->
    <div id="table-box">
      <Table border :columns="columns" :data="data">
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="addLongAdvice(index)">
            长期医嘱
          </Button>
          <Button type="primary" size="small" @click="addShortAdvice(index)">
            临时医嘱
          </Button>
        </template>
      </Table>

      <Modal width="1400px" :mask-closable="false" :closable="false" v-model="modal" title="添加长期医嘱">
        <div>
          <Button type="primary" @click="addLongData">添加</Button>
          <Button type="primary" @click="save">保存</Button>
          <Button type="primary" @click="sent">发送</Button>
          <Button type="error" @click="del">删除</Button>
        </div>
        <div id="table-box">
          <Table @on-select-all-cancel="selectAllCancel" @on-select-all="selectAll" @on-select="advicesSelective" @on-select-cancel="cancelSelect" max-height="500px"
            style="overflow:scroll" :columns="longAdviceColumns" :data="longAdviceList">
          </Table>
        </div>
        <div slot="footer">
          <Button @click="cancel()">关闭</Button>
        </div>
      </Modal>

      <Modal width="1400px" :mask-closable="false" :closable="false" v-model="modal2" title="添加临时医嘱">
        <div>
          <Button type="primary" @click="addShortData">添加</Button>
          <Button type="primary" @click="save2">保存</Button>
          <Button type="primary" @click="sent2">发送</Button>
          <Button type="error" @click="del2">删除</Button>
        </div>
        <div id="table-box">
          <Table @on-select-all-cancel="selectAllCancel" @on-select-all="selectAll" @on-select="advicesSelective" @on-select-cancel="cancelSelect" :columns="shortAdviceColumns"
            :data="shortAdviceList" max-height="500px" style="overflow:scroll"></Table>
        </div>
        <div slot="footer">
          <Button @click="cancel()">关闭</Button>
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
            width: 200,
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
              return h('div', this.moment(params.row.birth).format('YYYY-MM-DD'))
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
        longAdviceColumns: [{
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '开始时间',
            align: 'center',
            children: [{
                title: '开始日期',
                key: 'madvStartDate',
                align: 'center',
                width: 200,
                render: (h, {
                  row,
                  index
                }) => {
                  return h("DatePicker", {
                    props: {
                      value: row.madvStartDate,
                      format: 'yyyy年MM月dd日'
                    },
                    on: {
                      input: val => {
                        this.longAdviceList[index].madvStartDate = val;
                      }
                    }
                  })
                }
              },
              {
                title: '开始时间',
                key: 'madvStartTime',
                align: 'center',
                width: 200,
                render: (h, {
                  row,
                  index
                }) => {
                  return h("TimePicker", {
                    props: {
                      value: row.madvStartTime,
                      format: 'HH:mm',
                      confirm: true
                    },
                    on: {
                      input: val => {
                        this.longAdviceList[index].madvStartTime = val;
                      }
                    }
                  })
                }
              }
            ]
          },
          {
            title: '项目编号',
            key: 'madvOperatorNo',
            width: 200,
            render: (h, {
              row,
              index
            }) => {
              return h("AutoComplete", {
                  props: {
                    value: row.madvOperationNo,
                    placeholder: "请输入项目编号",
                    data: this.costItemList,
                    clearable: true
                  },
                  on: {
                    'on-select': val => {
                      this.initForm(index, val)
                    },
                    'on-search': val => {
                      this.getCostItem(this.longAdviceList[index])
                    },
                    'on-clear': val => {
                      this.clear(index)
                    },
                    input: val => {
                      this.longAdviceList[index].madvOperationNo = val;
                    }
                  }
                },
                this.costItemList.map(item => {
                  return h('Option', {
                    props: {
                      value: item.costItemNo,
                      label: item.costItemNo + '--' + item.costItemName
                    }
                  },item.costItemNo + '--' + item.costItemName)
                })
              );
            }
          },
          {
            title: '医嘱项目',
            key: 'madvOperation',
            align: 'center',
            width: 300,
            render: (h, {
              row,
              index
            }) => {
              return h("AutoComplete", {
                  props: {
                    value: row.madvOperation,
                    placeholder: "请输入项目名称",
                    data: this.costItemList,
                    clearable: true
                  },
                  on: {
                    'on-select': val => {
                      this.initForm(index, val)
                    },
                    'on-search': val => {
                      this.getCostItem(this.longAdviceList[index])
                    },
                    'on-clear': val => {
                      this.clear(index)
                    },
                    input: val => {
                      this.longAdviceList[index].madvOperation = val;
                    }
                  }
                },
                this.costItemList.map(item => {
                  return h('Option', {
                    props: {
                      value: item.costItemNo,
                      label: item.costItemNo + '--' + item.costItemName
                    }
                  },item.costItemNo + '--' + item.costItemName)
                })
              );
            }
          },
          {
            title: '项目类型',
            key: 'madvOperationType',
            width: 100
          },
          {
            title: '规格',
            key: 'madvSpecifications',
            width: 100,
            render: (h, params) => {
              return h("Input", {
                props: {
                  value: params.row.madvSpecifications
                },
                on: {
                  'on-blur': event => {
                    this.longAdviceList[params.index].madvSpecifications = event.target.value;
                  }
                }
              })
            }
          },
          {
            title: '剂量',
            key: 'madvDose',
            align: 'center',
            width: 100,
            render: (h, {
              row,
              index
            }) => {
              return h("Input", {
                props: {
                  value: row.madvDose
                },
                on: {
                  input: val => {
                    this.longAdviceList[index].madvDose = val;
                  }
                }
              })
            }
          },
          {
            title: '单位',
            key: 'madvUnit',
            width: 100
          },
          {
            title: '频次',
            key: 'madvFrequency',
            align: 'center',
            width: 150,
            render: (h, {
              row,
              index
            }) => {
              return h("Select", {
                props: {
                  value: row.madvFrequency
                },
                on: {
                  'on-select': val => {
                    this.longAdviceList[index].madvFrequency = val;
                  },
                  input: val => {
                    this.longAdviceList[index].madvFrequency = val;
                  }
                }
              },
              this.frequency.map(item=>{
                return h('Option',{
                  props:{
                    value:item.value,
                    label:item.name
                  }
                })
              })
              )
            }
          },
          {
            title: '用法',
            key: 'madvUsage',
            align: 'center',
            width: 150,
            render: (h, {
              row,
              index
            }) => {
              return h("Input", {
                props: {
                  value: row.madvUsage
                },
                on: {
                  input: val => {
                    this.longAdviceList[index].madvUsage = val;
                  }
                }
              })
            }
          },
          {
            title: '嘱托',
            key: 'entrustment',
            align: 'center',
            width: 150,
            render: (h, {
              row,
              index
            }) => {
              return h("Input", {
                props: {
                  value: row.entrustment
                },
                on: {
                  input: val => {
                    this.longAdviceList[index].entrustment = val;
                  }
                }
              })
            }
          },
          {
            title: '医嘱类型',
            key: 'madvType',
            width: 100
          },
          {
            title: '开嘱医生',
            key: 'madvDoctor',
            align: 'center',
            width: 150
          },
          {
            title: '医嘱状态',
            key: 'status',
            withd: 100
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
            title: '单价',
            key: 'madvPrice',
            align: 'center',
            width: 100
          },
          {
            title: '开嘱科室',
            key: 'deptName',
            width: 100
          },
          {
            title: '结束时间',
            align: 'center',
            children: [{
                title: '结束日期',
                key: 'endDate',
                align: 'center',
                width: 200
              },
              {
                title: '结束时间',
                key: 'endTime',
                align: 'center',
                width: 200
              }
            ]
          }
        ],
        shortAdviceColumns: [{
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '开始时间',
            align: 'center',
            children: [{
                title: '开始日期',
                key: 'madvStartDate',
                align: 'center',
                width: 200,
                render: (h, {
                  row,
                  index
                }) => {
                  return h("DatePicker", {
                    props: {
                      value: row.madvStartDate,
                      format: 'yyyy年MM月dd日'
                    },
                    on: {
                      input: val => {
                        this.shortAdviceList[index].madvStartDate = val;
                      }
                    }
                  })
                }
              },
              {
                title: '开始时间',
                key: 'madvStartTime',
                align: 'center',
                width: 200,
                render: (h, {
                  row,
                  index
                }) => {
                  return h("TimePicker", {
                    props: {
                      value: row.madvStartTime,
                      format: 'HH:mm',
                      confirm: true
                    },
                    on: {
                      input: val => {
                        this.shortAdviceList[index].madvStartTime = val;
                      }
                    }
                  })
                }
              }
            ]
          },
          {
            title: '项目编号',
            key: 'madvOperationNo',
            width: 200,
            render: (h, {
              row,
              index
            }) => {
              return h("AutoComplete", {
                  props: {
                    value: row.madvOperationNo,
                    placeholder: "请输入项目编号",
                    data: this.costItemList,
                    clearable: true
                  },
                  on: {
                    'on-select': val => {
                      this.initForm2(index, val)
                    },
                    'on-search': val => {
                      this.getCostItem2(this.shortAdviceList[index])
                    },
                    'on-clear': val => {
                      this.clear2(index)
                    },
                    input: val => {
                      this.shortAdviceList[index].madvOperationNo = val;
                    }
                  }
                },
                this.costItemList.map(item => {
                  return h('Option', {
                    props: {
                      value: item.costItemNo,
                      label: item.costItemNo + '--' + item.costItemName
                    }
                  })
                })
              );
            }
          },
          {
            title: '医嘱项目',
            key: 'madvOperation',
            align: 'center',
            width: 300,
            render: (h, {
              row,
              index
            }) => {
              return h("AutoComplete", {
                  props: {
                    value: row.madvOperation,
                    placeholder: "请输入项目名称",
                    data: this.costItemList,
                    clearable: true
                  },
                  on: {
                    'on-select': val => {
                      this.initForm2(index, val)
                    },
                    'on-search': val => {
                      this.getCostItem2(this.shortAdviceList[index])
                    },
                    'on-clear': val => {
                      this.clear2(index)
                    },
                    input: val => {
                      this.shortAdviceList[index].madvOperation = val;
                    }
                  }
                },
                this.costItemList.map(item => {
                  return h('Option', {
                    props: {
                      value: item.costItemNo,
                      label: item.costItemNo + '--' + item.costItemName
                    }
                  })
                })
              );
            }
          },
          {
            title: '项目类型',
            key: 'madvOperationType',
            width: 100
          },
          {
            title: '规格',
            key: 'madvSpecifications',
            width: 100,
            render: (h, {
              row,
              index
            }) => {
              return h("Input", {
                props: {
                  value: row.madvSpecifications
                },
                on: {
                  input: val => {
                    this.shortAdviceList[index].madvSpecifications = val;
                  }
                }
              })
            }
          },
          {
            title: '剂量',
            key: 'madvDose',
            align: 'center',
            width: 100,
            render: (h, {
              row,
              index
            }) => {
              return h("Input", {
                props: {
                  value: row.madvDose
                },
                on: {
                  input: val => {
                    this.shortAdviceList[index].madvDose = val;
                  }
                }
              })
            }
          },
          {
            title: '单位',
            key: 'madvUnit',
            width: 100
          },
          {
            title: '频次',
            key: 'madvFrequency',
            align: 'center',
            width: 150,
            render: (h, {
              row,
              index
            }) => {
              return h("Select", {
                props: {
                  value: row.madvFrequency
                },
                on: {
                  'on-select': val => {
                    this.shortAdviceList[index].madvFrequency = val;
                  },
                  input: val => {
                    this.shortAdviceList[index].madvFrequency = val;
                  }
                }
              },
              this.frequency.map(item=>{
                return h('Option',{
                  props:{
                    value:item.value,
                    label:item.name
                  }
                })
              })
              )
            }
          },
          {
            title: '用法',
            key: 'madvUsage',
            align: 'center',
            width: 150,
            render: (h, {
              row,
              index
            }) => {
              return h("Input", {
                props: {
                  value: row.madvUsage
                },
                on: {
                  input: val => {
                    this.shortAdviceList[index].madvUsage = val;
                  }
                }
              })
            }
          },
          {
            title: '嘱托',
            key: 'entrustment',
            align: 'center',
            width: 150,
            render: (h, {
              row,
              index
            }) => {
              return h("Input", {
                props: {
                  value: row.entrustment
                },
                on: {
                  input: val => {
                    this.shortAdviceList[index].entrustment = val;
                  }
                }
              })
            }
          },
          {
            title: '医嘱类型',
            key: 'madvType',
            width: 100
          },
          {
            title: '开嘱医生',
            key: 'madvDoctor',
            align: 'center',
            width: 150
          },
          {
            title: '医嘱状态',
            key: 'status',
            withd: 100
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
            title: '单价',
            key: 'madvPrice',
            align: 'center',
            width: 100
          },
          {
            title: '开嘱科室',
            key: 'deptName',
            width: 100
          },
          {
            title: '结束时间',
            align: 'center',
            children: [{
                title: '结束日期',
                key: 'endDate',
                align: 'center',
                width: 200
              },
              {
                title: '结束时间',
                key: 'endTime',
                align: 'center',
                width: 200
              }
            ]
          }
        ],
        costItemList: [],
        selectCostItem:{},
        drugList: [],
        longAdviceList: [],
        shortAdviceList: [],
        data: [],
        modal: false,
        modal2: false,
        total: 0,
        deptList: [],
        conditionForm: {
          deptName: '',
          pid: '',
          pname: '',
          admissionNumber: '',
          admissionOfDateStart: '',
          admissionOfDateEnd: ''
        },
        patientForm: {
          deptName: '',
          admissionId: '',
          madvDoctor: '',
        },
        frequency:[
          {
            name:'每天一次',
            value: 1
          },
          {
            name:'每天二次',
            value: 2
          },
          {
            name:'每天三次',
            value:3
          },
          {
            name:'每小时一次',
            value: 24
          },
          {
            name:'每两小时一次',
            value:12
          },
          {
            name:'每六小时一次',
            value:4
          }
        ],
        selectiveList: []
      }
    },

    components: {
      PatientSelectCard
    },

    created() {
      this.patientForm.madvDoctor = JSON.parse(localStorage.getItem("TOKEN")).username;
      this.getDept()
      this.getInpatientInformation()
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
      getInpatientInformation() {
        this.$http({
            url: 'advice/getInformationByCondition',
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
      search(deptIdSelective, pid, pname, admissionNumber, admissionOfDate) {
        this.conditionForm = {
          deptName: deptIdSelective,
          pid: pid,
          pname: pname,
          admissionNumber: admissionNumber,
          admissionOfDateStart: admissionOfDate[0],
          admissionOfDateEnd: admissionOfDate[1]
        }
        this.$http({
            url: 'advice/getInformationByCondition',
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
            url: 'advice/getInformationByCondition',
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
      addLongAdvice(index) {
        this.patientForm.deptName = this.data[index].deptName;
        this.patientForm.admissionId = this.data[index].id;
        this.modal = true;
      },
      addShortAdvice(index) {
        this.patientForm.deptName = this.data[index].deptName;
        this.patientForm.admissionId = this.data[index].id;
        this.modal2 = true;
      },
      cancel() {
        this.modal = false;
        this.longAdviceList = []
        this.modal2 = false;
        this.shortAdviceList = []
      },
      addLongData() {
        const addData = {
          admissionId: this.patientForm.admissionId,
          madvStartDate: new Date(),
          madvStartTime: new Date(),
          madvOperationNo: '',
          madvOperation: '',
          madvOperationType: '',
          madvType: '长期医嘱',
          madvSpecifications: '',
          madvDose: '',
          madvUnit: '',
          madvFrequency: 1,
          madvUsage: '',
          entrustment: '',
          madvPrice: '',
          madvDoctor: this.patientForm.madvDoctor,
          deptName: this.patientForm.deptName
        };
        this.longAdviceList.push(addData);
      },
      addShortData() {
        const addData = {
          admissionId: this.patientForm.admissionId,
          madvStartDate: new Date(),
          madvStartTime: new Date(),
          madvOperationNo: '',
          madvOperation: '',
          madvOperationType: '',
          madvType: '临时医嘱',
          madvSpecifications: '',
          madvDose: '',
          madvUnit: '',
          madvFrequency: 1,
          madvUsage: '',
          entrustment: '',
          madvPrice: '',
          madvDoctor: this.patientForm.madvDoctor,
          deptName: this.patientForm.deptName
        };
        this.shortAdviceList.push(addData);
      },
      save() {
        if (this.selectiveList.length === 0) {
          this.$Message.info("请选择要操作的选项")
        }else{
          this.$http({
              url: 'advice/saveAdvice',
              method: 'POST',
              data: this.selectiveList
            })
            .then((res) => {
              if (res.data.status === 200) {
                for (var i = 0; i < this.longAdviceList.length; i++) {
                  for (var j = 0; j < this.selectiveList.length; j++) {
                    if (this.selectiveList[j].madvOperationNo === this.longAdviceList[i].madvOperationNo) {
                      this.longAdviceList.splice(i, 1)
                    } else {
                      console.log('没有选中删除')
                    }
                  }
                }
                this.selectiveList = [];
                this.$Message.info(res.data.data)
              } else if (res.data.status === 500) {
                this.$Message.info(res.data.msg)
              }
            })
            .catch((err) => {
              console.log(err);
            });
          }
      },
      sent() {
        if (this.selectiveList.length === 0) {
          this.$Message.info("请选择要操作的选项")
        }else{
          this.$http({
              url: 'advice/sentAdvice',
              method: 'POST',
              data: this.selectiveList
            })
            .then((res) => {
              if (res.data.status === 200) {
                for (var i = 0; i < this.longAdviceList.length; i++) {
                  for (var j = 0; j < this.selectiveList.length; j++) {
                    if (this.selectiveList[j].madvOperationNo === this.longAdviceList[i].madvOperationNo) {
                      this.longAdviceList.splice(i, 1)
                    } else {
                      console.log('没有选中删除')
                    }
                  }
                }
                this.selectiveList = [];
                this.$Message.info(res.data.data)
              }else if (res.data.status === 500) {
                this.$Message.info(res.data.msg)
                } 
            })
            .catch((err) => {
              console.log(err);
            });
          }
      },
      save2() {
        if (this.selectiveList.length === 0) {
          this.$Message.info("请选择要操作的选项")
        }else{
          this.$http({
              url: 'advice/saveAdvice',
              method: 'POST',
              data: this.selectiveList
            })
            .then((res) => {
              if (res.data.status === 200) {
                for (var i = 0; i < this.shortAdviceList.length; i++) {
                  for (var j = 0; j < this.selectiveList.length; j++) {
                    if (this.selectiveList[j].madvOperationNo === this.shortAdviceList[i].madvOperationNo) {
                      this.shortAdviceList.splice(i, 1)
                    } else {
                      console.log('没有选中删除')
                    }
                  }
                }
                this.selectiveList = [];
                this.$Message.info(res.data.data)
              } else if (res.data.status === 500) {
                this.$Message.info(res.data.msg)
              }
            })
            .catch((err) => {
              console.log(err);
            });
          }
      },
      sent2() {
        if (this.selectiveList.length === 0) {
          this.$Message.info("请选择要操作的选项")
        }else{
          this.$http({
              url: 'advice/sentAdvice',
              method: 'POST',
              data: this.selectiveList
            })
            .then((res) => {
              if (res.data.status === 200) {
                for (var i = 0; i < this.shortAdviceList.length; i++) {
                  for (var j = 0; j < this.selectiveList.length; j++) {
                    if (this.selectiveList[j].madvOperationNo === this.shortAdviceList[i].madvOperationNo) {
                      this.shortAdviceList.splice(i, 1)
                    } else {
                      console.log('没有选中删除')
                    }
                  }
                }
                this.selectiveList = [];
                this.$Message.info(res.data.data)
              }else if (res.data.status === 500) {
                this.$Message.info(res.data.msg)
                } 
            })
            .catch((err) => {
              console.log(err);
            });
          }
      },
      del() {
        if (this.selectiveList.length === 0) {
          this.$Message.info("请选择要操作的选项")
        }else{
          for (var i = 0; i < this.longAdviceList.length; i++) {
            for (var j = 0; j < this.selectiveList.length; j++) {
              if (this.selectiveList[j].madvOperationNo === this.longAdviceList[i].madvOperationNo) {
                this.longAdviceList.splice(i, 1)
              } else {
                console.log('没有选中删除')
              }
            }
          }
          this.selectiveList = [];
        }
      },
      del2() {
        if (this.selectiveList.length === 0) {
          this.$Message.info("请选择要操作的选项")
        }else{
          for (var i = 0; i < this.shortAdviceList.length; i++) {
            for (var j = 0; j < this.selectiveList.length; j++) {
              if (this.selectiveList[j].madvOperationNo === this.shortAdviceList[i].madvOperationNo) {
                this.shortAdviceList.splice(i, 1)
              } else {
                console.log('没有选中删除')
              }
            }
          }
          this.selectiveList = [];
        }
      },
      getCostItem(value) {
        this.$http({
            url: 'costItem/getCostItem',
            method: 'GET',
            params: {
              costItemNo: value.madvOperationNo,
              costItemName: value.madvOperation
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
      getCostItem2(value) {
        this.$http({
            url: 'costItem/getCostItem',
            method: 'GET',
            params: {
              costItemNo: value.madvOperationNo,
              costItemName: value.madvOperation
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
      initForm(index, value) {
        this.$http({
            url: 'costItem/getCostItemByNo',
            method: 'GET',
            params: {
              costItemNo: value
            }
          })
          .then(res => {
            if (res.data.status === 200) {
              this.selectCostItem = res.data.data;
              this.longAdviceList[index].madvOperationNo = this.selectCostItem.costItemNo
              this.longAdviceList[index].madvOperation = this.selectCostItem.costItemName
              this.longAdviceList[index].madvPrice = this.selectCostItem.costItemPrice
              this.longAdviceList[index].madvSpecifications = this.selectCostItem.costItemSpecifications
              this.longAdviceList[index].madvDose = this.selectCostItem.costItemDose
              this.longAdviceList[index].madvOperationType = this.selectCostItem.costItemType
              this.longAdviceList[index].madvUnit = this.selectCostItem.costItemUnit
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            this.$Message.error("服务器出错！")
          })
      },
      initForm2(index, value) {
        this.$http({
            url: 'costItem/getCostItemByNo',
            method: 'GET',
            params: {
              costItemNo: value
            }
          })
          .then(res => {
            if (res.data.status === 200) {
              this.selectCostItem = res.data.data;
              this.shortAdviceList[index].madvOperationNo = this.selectCostItem.costItemNo
              this.shortAdviceList[index].madvOperation = this.selectCostItem.costItemName
              this.shortAdviceList[index].madvPrice = this.selectCostItem.costItemPrice
              this.shortAdviceList[index].madvSpecifications = this.selectCostItem.costItemSpecifications
              this.shortAdviceList[index].madvDose = this.selectCostItem.costItemDose
              this.shortAdviceList[index].madvOperationType = this.selectCostItem.costItemType
              this.shortAdviceList[index].madvUnit = this.selectCostItem.costItemUnit
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            this.$Message.error("服务器出错！")
          })
      },
      advicesSelective(selection, row) {
        this.selectiveList = selection
      },
      cancelSelect(selection, row) {
        this.selectiveList = selection
      },
      clear(index) {
        this.longAdviceList[index].madvOperationNo = ''
        this.longAdviceList[index].madvOperation = ''
        this.longAdviceList[index].madvPrice = ''
        this.longAdviceList[index].madvSpecifications = ''
        this.longAdviceList[index].madvDose = ''
        this.longAdviceList[index].madvOperationType = ''
        this.longAdviceList[index].madvUnit = ''
      },
      clear2(index) {
        this.shortAdviceList[index].madvOperationNo = ''
        this.shortAdviceList[index].madvOperation = ''
        this.shortAdviceList[index].madvPrice = ''
        this.shortAdviceList[index].madvSpecifications = ''
        this.shortAdviceList[index].madvDose = ''
        this.shortAdviceList[index].madvOperationType = ''
        this.shortAdviceList[index].madvUnit = ''
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
  #table-box {
    margin-top: 10px;
  }

  #page-box {
    margin-top: 10px;
  }

</style>
