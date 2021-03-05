<style scoped>
  .btn-box {
    text-align: left;
    margin: 5px;
  }

  .page-box {
    margin-top: 10px;
  }

</style>
<template>
  <div id="costItemEdit">
    <!-- 查询条件 -->
    <div style="background:#eee;padding:20px">
      <Card :bordered="false">
        <div id="cardItem">
          <Select filterable clearable v-model="conditionForm.costItemType" style="width:200px">
            <Option v-for="item in costItemTypeList" :value="item.costItemType" :key="item.costItemType">
              {{ item.costItemType }}</Option>
          </Select>
          <Input v-model="conditionForm.costItemNo" placeholder="请输入项目编号" clearable
            style="width: 200px; margin-right:5px" />
          <Input v-model="conditionForm.costItemName" placeholder="请输入项目名" clearable
            style="width: 200px;margin-right:5px" />
          <Button class="search-btn" type="primary" shape="circle" icon="ios-search" @click="getCostItem()"></Button>
        </div>
      </Card>
    </div>
    <!-- 操作按钮 -->
    <div class="btn-box">
      <Button type="error" @click="check()">删除</Button>
      <Button type="primary" @click="addShow()">新增</Button>
      <Modal :mask-closable="false" :closable="false" v-model="modal2" title="提示">
        此操作无法恢复,请确认是否删除!
        <div slot="footer">
          <Button type="error" @click="del()">是</Button>
          <Button @click="no()">取消</Button>
        </div>
      </Modal>

      <Modal :mask-closable="false" :closable="false" v-model="modal3" title="新增费用项">
        <Form ref="add" label-colon=":" :rules="ruleValidate" label-position="right" :label-width="100"
          :model="addForm">
          <FormItem label="项目编号" prop="costItemNo">
            <Input v-model="addForm.costItemNo" />
          </FormItem>
          <FormItem label="项目名称" prop="costItemName">
            <Input v-model="addForm.costItemName" />
          </FormItem>
          <FormItem label="项目类型" prop="costItemType">
            <Select filterable clearable v-model="addForm.costItemType" style="width:200px">
              <Option v-for="item in costItemTypeList" :value="item.costItemType" :key="item.costItemType">
                {{ item.costItemType }}</Option>
            </Select>
          </FormItem>
          <FormItem label="单位" prop="costItemUnit">
            <Input v-model="addForm.costItemUnit" />
          </FormItem>
          <FormItem label="单价" prop="costItemPrice">
            <Input v-model="addForm.costItemPrice" />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="add()">新增</Button>
          <Button @click="addCancel()">取消</Button>
        </div>
      </Modal>

    </div>
    <!-- 数据表格 -->
    <div class="table-box">
      <Table @on-select-all-cancel="selectAllCancel" @on-select-all="selectAll"
        @on-select="advicesSelective" @on-select-cancel="cancelSelect" border :columns="columns" :data="data">
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" @click="update(index)">更改</Button>
        </template>
      </Table>

      <Modal :mask-closable="false" :closable="false" v-model="modal" title="更改信息">
        <Form ref="update" label-colon=":" :rules="ruleValidate" label-position="right" :label-width="100"
          :model="updateForm">
          <FormItem label="项目编号" prop="costItemNo">
            <Input disabled v-model="updateForm.costItemNo" />
          </FormItem>
          <FormItem label="项目名称" prop="costItemName">
            <Input v-model="updateForm.costItemName" />
          </FormItem>
          <FormItem label="项目类型" prop="costItemType">
            <Select filterable clearable v-model="updateForm.costItemType" style="width:200px">
              <Option v-for="item in costItemTypeList" :value="item.costItemType" :key="item.costItemType">
                {{ item.costItemType }}</Option>
            </Select>
          </FormItem>
          <FormItem label="单位" prop="costItemUnit">
            <Input v-model="updateForm.costItemUnit" />
          </FormItem>
          <FormItem label="单价" prop="costItemPrice">
            <Input v-model="updateForm.costItemPrice" />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="updated()">更新</Button>
          <Button @click="cancelupdate()">取消</Button>
        </div>
      </Modal>

    </div>
    <!-- 分页组件 -->
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
            algin: 'center'
          },
          {
            title: '操作',
            slot: 'action',
            width: 100,
            algin: 'center'
          },
          {
            type: 'index',
            width: 60,
            algin: 'center'
          },
          {
            title: '项目编号',
            key: 'costItemNo'
          },
          {
            title: '项目名称',
            key: 'costItemName',
            render:(h, params) => {
              return h('div', [
                h('span', {
                  style: {display: 'inline-block', 
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'},
                  domProps: {title: params.row.costItemName},
                  on:{click:(e) => { e.stopPropagation();}}
                }, params.row.costItemName)
              ]);
          }
          },
          {
            title: '项目单价/元',
            key: 'costItemPrice'
          },
          {
            title: '项目类型',
            key: 'costItemType'
          },
          {
            title: '项目单位',
            key: 'costItemUnit'
          }
        ],
        data: [],
        conditionForm: {
          costItemNo: '',
          costItemName: '',
          costItemType: ''
        },
        costItemTypeList: [],
        modal: false,
        modal2: false,
        modal3: false,
        total: 0,
        selectiveList: [],
        updateForm: {
          costItemNo: '',
          costItemName: '',
          costItemPrice: '',
          costItemType: '',
          costItemUnit: ''
        },
        addForm: {
          costItemNo: '',
          costItemName: '',
          costItemPrice: '',
          costItemType: '',
          costItemUnit: ''
        },
        ruleValidate: {
          costItemPrice: [{
              required: true,
              message: '单价不能为空',
              trigger: 'blur'
            },
            {
              pattern: /^\d+(\.\d+)?$/,
              message: '请输入数字',
              trigger: 'change'
            }
          ],
          costItemNo: [{
            required: true,
            message: '编号不能为空',
            trigger: 'blur'
          }],
          costItemName: [{
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }],
          costItemType: [{
            required: true,
            message: '类型不能为空',
            trigger: 'blur'
          }],
          costItemUnit: [{
            required: true,
            message: '单位不能为空',
            trigger: 'blur'
          }]
        }
      }
    },

    created() {
      this.getCostItem();
      this.getCostItemType();
    },

    methods: {
      getCostItemType() {
        this.$http({
            url: 'common/getCostItemType',
            method: 'GET'
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.costItemTypeList = res.data.data
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      selectAllCancel() {
        this.selectiveList = []
      },
      selectAll(selection) {
        this.selectiveList = selection
      },
      advicesSelective(selection, row) {
        this.selectiveList = selection
      },
      cancelSelect(selection, row) {
        this.selectiveList = selection
      },
      update(index) {
        this.updateForm = this.data[index]
        this.modal = true;
      },
      getCostItem() {
        this.$http({
            url: 'costItem/getCostItems',
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
            url: 'costItem/getCostItems',
            method: 'GET',
            params: {
              costItemNo: this.conditionForm.costItemNo,
              costItemName: this.conditionForm.costItemName,
              costItemType: this.conditionForm.costItemType,
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
      update(index) {
        this.updateForm = this.data[index]
        this.modal = true
      },
      updated() {
        this.$refs.update.validate(valid => {
          if (valid) {
            this.$http({
                url: 'costItem/updateCostItem',
                method: 'POST',
                data: this.updateForm
              })
              .then((res) => {
                if (res.data.status === 200) {
                  this.modal = false;
                  this.$Message.info(res.data.data)
                  this.$refs.update.resetFields()
                  this.getCostItem()
                } else if (res.data.status === 500) {
                  this.$Message.info(res.data.msg)
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })

      },
      cancelupdate() {
        this.modal = false;
      },
      check() {
        if (this.selectiveList.length === 0) {
          this.$Message.info("请选择要操作的选项")
        } else {
          this.modal2 = true;
        }
      },
      del() {
        this.$http({
            url: 'costItem/delCostItem',
            method: 'POST',
            data: this.selectiveList
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.$Message.info(res.data.data)
              this.modal2 = false;
              this.getCostItem()
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.data)
              this.modal2 = false;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      no() {
        this.modal2 = false;
      },
      addCancel() {
        this.$refs.add.resetFields()
        this.modal3 = false;
      },
      addShow() {
        this.modal3 = true;
      },
      add() {
        this.$refs.add.validate(valid => {
          if (valid) {
            this.$http({
                url: 'costItem/addCostItem',
                method: 'POST',
                data: this.addForm
              })
              .then((res) => {
                if (res.data.status === 200) {
                  this.$Message.info(res.data.data)
                  this.modal3 = false;
                  this.$refs.add.resetFields()
                  this.getCostItem()
                } else if (res.data.status === 500) {
                  this.$Message.info(res.data.msg)
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
      }
    }
  }

</script>
