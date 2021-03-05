<template>
  <div id="drugApplyCancel">
    <!-- 条件查询区域 -->
    <div id="select-box">
      <div style="background:#eee;padding:20px">
        <Card :bordered="false">
          <div id="cardItem">
            <Select filterable clearable v-model="conditionForm.deptName" style="width:200px">
              <Option v-for="item in deptList" :value="item.deptName" :key="item.deptName">{{ item.deptName }}</Option>
            </Select>
            <Input v-model="conditionForm.admissionNumber" placeholder="请输入住院号" clearable
              style="width: 200px; margin-right:5px" />
            <Input v-model="conditionForm.name" placeholder="请输入病患名" clearable style="width: 200px; margin-right:5px" />
            <Input v-model="conditionForm.drugNo" placeholder="请输入药品编号" clearable
              style="width: 200px; margin-right:5px" />
            <Input v-model="conditionForm.drugNo" placeholder="请输入药品名称" clearable
              style="width: 200px; margin-right:5px" />
            <Button class="search-btn" type="primary" shape="circle" icon="ios-search" @click="getApplication"></Button>
          </div>
        </Card>
      </div>
    </div>
    <div id="btn-box">
      <Button type="primary" @click="cancelApply">取消申请</Button>
    </div>
    <!-- 表格区域 -->
    <div id="table-box">
      <Table @on-select-all-cancel="selectAllCancel" @on-select-all="selectAll"
        @on-select="advicesSelective" @on-select-cancel="cancelSelect" border :columns="columns" :data="data">
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
            key: 'deptName',
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
            title: '药品编号',
            key: 'drugNo',
            width: 150,
            render:(h, params) => {
              return h('div', [
                h('span', {
                  style: {display: 'inline-block', 
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'},
                  domProps: {title: params.row.drugNo},
                  on:{click:(e) => { e.stopPropagation();}}
                }, params.row.drugNo)
              ]);
          }
          },
          {
            title: '药品名称',
            key: 'drugName',
            width: 150,
            render:(h, params) => {
              return h('div', [
                h('span', {
                  style: {display: 'inline-block', 
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'},
                  domProps: {title: params.row.drugName},
                  on:{click:(e) => { e.stopPropagation();}}
                }, params.row.drugName)
              ]);
          }
          },
          {
            title: '药品类型',
            key: 'drugType',
            width: 100
          },
          {
            title: '规格',
            key: 'drugSpecifications',
            width: 100
          },
          {
            title: '剂量',
            key: 'drugDose',
            width: 100
          },
          {
            title: '单位',
            key: 'drugUnit',
            width: 80
          },
          {
            title: '单价',
            key: 'drugPrice',
            width: 100
          },
          {
            title: '需求科室',
            key: 'drugRequireDept',
            width: 100
          },
          {
            title: '需求数量',
            key: 'drugRequireNumber',
            width: 120
          },
          {
            title: '申请人',
            key: 'operator',
            width: 150
          },
          {
            title: '申请日期',
            key: 'applyDate',
            width: 150,
            render: (h, params) => {
              return h('div', params.row.applyDate == null ? '' : this.moment(params.row.applyDate)
                .format('YYYY-MM-DD'))
            }
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
                      color: 'blue'
                    }
                  }),
                  h('span', {
                    style: {
                      color: 'blue'
                    }
                  }, '未申请')
                ])
              } else if (params.row.status === 1) {
                return h('div', [
                  h('Badge', {
                    attrs: {
                      color: 'green'
                    }
                  }),
                  h('span', {
                    style: {
                      color: 'green'
                    }
                  }, '已申请')
                ])
              }
            }
          },
          {
            title: '发药日期',
            key: 'offerDate',
            width: 150,
            render: (h, params) => {
              return h('div', params.row.offerDate == null ? '' : this.moment(params.row.offerDate)
                .format('YYYY-MM-DD'))
            }
          },
          {
            title: '发药人',
            key: 'offerOperator',
            width: 100
          }
        ],
        data: [],
        deptList: [],
        conditionForm: {
          name: '',
          admissionNumber: '',
          drugNo: '',
          drugName: '',
          deptName: ''
        },
        total: 0,
        modal: false,
        selectiveList: [],
        username: ''
      }
    },
    created() {
      this.username = JSON.parse(localStorage.getItem("TOKEN")).username;
      this.getDept()
      this.getApplication();
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
      getApplication() {
        this.$http({
            url: 'drug/getApply2',
            method: 'GET',
            params: this.conditionForm
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.data = res.data.data.list;
              this.total = res.data.data.total;
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
            url: 'drug/getApply2',
            method: 'GET',
            params: {
              deptName: this.conditionForm.deptName,
              name: this.conditionForm.name,
              admissionNumber: this.conditionForm.admissionNumber,
              drugNo: this.conditionForm.drugNo,
              drugName: this.conditionForm.drugName,
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
          });
      },
      advicesSelective(selection, row) {
        this.selectiveList = selection
      },
      cancelSelect(selection, row) {
        this.selectiveList = selection
      },
      cancelApply() {
        if (this.selectiveList.length === 0) {
          this.$Message.info("请先选择要操作的医嘱")
        } else {
          this.$http({
              url: 'drug/cancelApply',
              method: 'POST',
              data: {
                selectiveList: this.selectiveList,
                operator: this.username
              }
            })
            .then((res) => {
              if (res.data.status === 200) {
                this.$Message.info(res.data.data)
                this.getApplication()
              } else if (res.data.status === 500) {
                this.$Message.info(res.data.msg)
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      },
      selectAllCancel() {
        this.selectiveList = []
      },
      selectAll(selection) {
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
