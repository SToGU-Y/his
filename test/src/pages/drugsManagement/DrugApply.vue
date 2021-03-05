<template>
  <div id="drugApply">
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
      <Button type="primary" @click="apply">申请</Button>
      <Button type="error" @click="modal = true">删除</Button>
      <Button type="primary" @click="modal2 = true">补申</Button>
      <Modal :mask-closable="false" :closable="false" v-model="modal" title="提示">
        此操作无法恢复,请确认是否删除!
        <div slot="footer">
          <Button type="primary" @click="del()">删除</Button>
          <Button @click="cancel()">取消</Button>
        </div>
      </Modal>

      <Modal width="800px" :mask-closable="false" :closable="false" v-model="modal2" title="补申">
        <Form ref="applys" label-colon=":" :rules="ruleValidate" :model="applyForm" label-position="right"
          :label-width="100">
          <Row>
            <Col span="12">
            <FormItem label="住院号" prop="admissionNumber">
              <Input v-model="applyForm.admissionNumber"></Input>
            </FormItem>
            </Col>
          </Row>     
          <Row>
            <Col span="12">
            <FormItem label="药品编号" prop="drugNo">
              <AutoComplete v-model="applyForm.drugNo" :data="drugList" placeholder="请输入药品编号" clearable
              @on-search="getDrug" @on-select="initForm" @on-clear="clear">
                <Option v-for="drug in drugList" :key="drug.drugId+'dasd'" :value="drug.drugId">
                  <span>{{drug.drugNo}}</span>--<span>{{drug.drugName}}</span>--<span>{{drug.drugType}}</span>--<span>{{drug.drugPrice}}</span>
                </Option>
              </AutoComplete>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="药品名称" prop="drugName">
              <AutoComplete v-model="applyForm.drugName" :data="drugList" placeholder="请输入药品名称" clearable @on-search="getDrug"
                @on-select="initForm" @on-clear="clear">
                <Option v-for="drug in drugList" :key="drug.drugId" :value="drug.drugId">
                  <span>{{drug.drugNo}}</span>--<span>{{drug.drugName}}</span>--<span>{{drug.drugSpecifications}}</span>--<span>{{drug.doseUnit}}</span>
                </Option>
              </AutoComplete>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="药品类型" prop="drugType">
              <Input disabled v-model="applyForm.drugType"></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="药品规格" prop="drugSpecifications">
              <Input disabled v-model="applyForm.drugSpecifications"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="药品剂量" prop="drugDose">
              <Input v-model="applyForm.drugDose"></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="药品单位" prop="drugUnit">
              <Input disabled v-model="applyForm.drugUnit"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
            <FormItem label="药品单价" prop="drugPrice">
              <Input disabled v-model="applyForm.drugPrice"></Input>
            </FormItem>
            </Col>
            <Col span="12">
            <FormItem label="需求数量" prop="drugRequireNumber">
              <Input v-model="applyForm.drugRequireNumber"></Input>
            </FormItem>
            </Col>
          </Row>
          <FormItem label="需求科室" prop="drugRequireDept">
            <Select filterable v-model="applyForm.drugRequireDept">
              <Option v-for="dept in deptList" :value="dept.deptName" :key="dept.deptName">
                {{ dept.deptName }}</Option>
            </Select>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="applys()">补申</Button>
          <Button @click="no()">取消</Button>
        </div>
      </Modal>
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
        drugList:[],
        conditionForm: {
          name: '',
          admissionNumber: '',
          drugNo: '',
          drugName: '',
          deptName: ''
        },
        applyForm: {
          admissionNumber: '',
          drugNo: '',
          drugName: '',
          drugType: '',
          drugSpecifications: '',
          drugUnit: '',
          drugDose: '',
          drugPrice: '',
          drugRequireDept: '',
          drugRequireNumber: '',
          operator: this.username
        },
        total: 0,
        modal: false,
        modal2: false,
        selectiveList: [],
        username: '',
        ruleValidate: {
          admissionNumber: [{
              required: true,
              message: '住院号不能为空',
              trigger: 'blur'
            },
            {
              pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
              message: '请输入数字',
              trigger: 'blur'
            }
          ],
          name: [{
            required: true,
            message: '姓名不能为空',
            trigger: 'change'
          }],
          deptName: [{
            required: true,
            message: '入住科室不能为空',
            trigger: 'change'
          }],
          wardId: [{
            required: true,
            message: '病房号不能为空',
            trigger: 'change'
          }, {
            pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
            message: '请输入数字',
            trigger: 'change'
          }],
          bid: [{
            required: true,
            message: '床位号不能为空',
            trigger: 'blur'
          }, {
            pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
            message: '请输入数字',
            trigger: 'change'
          }],
          drugNo: [{
            required: true,
            message: '药品编号不能为空',
            trigger: 'blur'
          }],
          drugName: [{
            required: true,
            message: '药品名称不能为空',
            trigger: 'blur'
          }],
          drugType: [{
            required: true,
            message: '药品类型不能为空',
            trigger: 'blur'
          }],
          drugSpecifications: [{
            required: true,
            message: '药品规格不能为空',
            trigger: 'blur'
          }],
          drugUnit: [{
            required: true,
            message: '药品单位不能为空',
            trigger: 'blur'
          }],
          drugDose: [{
            required: true,
            message: '药品剂量不能为空',
            trigger: 'blur'
          }],
          drugPrice: [{
              required: true,
              message: '药品单价不能为空',
              trigger: 'blur',
              type: 'number'
            },
            {
              pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
              message: '请输入数字',
              trigger: 'blur'
            }
          ],
          drugRequireNumber: [{
              required: true,
              message: '药品需求数量不能为空',
              trigger: 'blur'
            },
            {
              pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
              message: '请输入数字',
              trigger: 'change'
            }
          ],
          drugRequireDept: [{
            required: true,
            message: '需求科室不能为空',
            trigger: 'blur'
          }]
        }
      }
    },
    created() {
      this.username = JSON.parse(localStorage.getItem("TOKEN")).username;
      this.applyForm.operator = JSON.parse(localStorage.getItem("TOKEN")).username;
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
            }
          })
          .catch(err => {
            console.log(err)
            this.$Message.info("服务器出错")
          })
      },
      getApplication() {
        this.$http({
            url: 'drug/getApply',
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
            url: 'drug/getApply',
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
      apply() {
        if (this.selectiveList.length === 0) {
          this.$Message.info("请先选择要操作的选项")
        } else {
          this.$http({
              url: 'drug/apply',
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
      applys() {
        this.$refs.applys.validate(valid=>{
          if (valid) {
            this.$http({
              url:'drug/applys',
              method:'POST',
              data:this.applyForm
            })
            .then((res) => {
              if (res.data.status === 200) {
                this.$Message.info(res.data.data)
                this.modal2 = false;
                this.$refs.applys.resetFields()
              }else if (res.data.status === 500) {
                this.$Message.info(res.data.msg)
              }
            })
            .catch((err) => {
              console.log(err);  
            });
          }
        })
      },
      no() {
        this.$refs.applys.resetFields();
        this.modal2 = false;
      },
      del() {
        this.$http({
            url: 'drug/deleteDrugApply',
            method: 'POST',
            data: this.selectiveList
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.$Message.info(res.data.data)
              this.modal = false;
              this.selectiveList = []
              this.getApplication()
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      cancel() {
        this.modal = false;
      },
      selectAllCancel() {
        this.selectiveList = []
      },
      selectAll(selection) {
        this.selectiveList = selection
      },
      initForm(value) {
        this.$http({
            url: 'drug/getDrugById',
            method: 'GET',
            params: {
              drugId: value
            }
          })
          .then(res => {
            if (res.data.status === 200) {
              this.drugList = res.data.data;
              this.applyForm.drugNo = this.drugList.drugNo
              this.applyForm.drugName = this.drugList.drugName
              this.applyForm.drugPrice = this.drugList.drugPrice
              this.applyForm.drugType = this.drugList.drugType
              this.applyForm.drugSpecifications = this.drugList.drugSpecifications
              this.applyForm.drugUnit = this.drugList.drugUnit
              this.applyForm.doseUnit = this.drugList.doseUnit
            } else if (res.data.status === 500) {
              this.$Message.info("找不到该药品")
            }
          })
          .catch(err => {
            this.$Message.error("服务器出错！")
          })
      },
      getDrug() {
        this.$http({
            url: 'drug/getAllDrug',
            method: 'GET',
            params: {
              drugNo: this.applyForm.drugNo,
              drugName: this.applyForm.drugName
            }
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.drugList = res.data.data.list;
            }else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      clear(){
          this.applyForm.drugNo = ''
          this.applyForm.drugName = ''
          this.applyForm.drugPrice = ''
          this.applyForm.drugType = ''
          this.applyForm.drugSpecifications = ''
          this.applyForm.drugUnit = ''
          this.applyForm.doseUnit = ''
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
