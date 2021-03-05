<style scoped>
  #btn-box {
    text-align: left;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  #page-box {
    margin-top: 10px;
  }

</style>
<template>
  <div id="equipmentAdd">
    <div style="background:#eee;padding:20px">
      <Card :bordered="false">
        <div id="cardItem">
          <Select filterable clearable v-model="conditionForm.type" style="width:200px">
            <Option v-for="appliance in applianceTypeList" :value="appliance.mtName" :key="appliance.mtName">
              {{ appliance.mtName }}</Option>
          </Select>
          <Input v-model="conditionForm.name" placeholder="请输入设备名" clearable style="width: 200px; margin-right:5px" />
          <Input v-model="conditionForm.no" placeholder="请输入设备编号" clearable style="width: 200px;margin-right:5px" />
          <Button class="search-btn" type="primary" shape="circle" icon="ios-search" @click="getEquipment()"></Button>
        </div>
      </Card>
    </div>
    <div id="btn-box">
      <Button type="primary" @click="showAddPanel">登记</Button>
      <Modal :mask-closable="false" :closable="false" v-model="modal" title="登记器械">
        <Form ref="add" label-colon=":" :rules="ruleValidate" :model="form" label-position="right" :label-width="100">
          <FormItem label="器械编号" prop="no">
            <Input v-model="form.no"></Input>
          </FormItem>
          <FormItem label="器械名称" prop="name">
            <Input v-model="form.name"></Input>
          </FormItem>
          <FormItem label="器械类型" prop="type">
            <Select filterable v-model="form.type">
              <Option v-for="appliance in applianceTypeList" :value="appliance.mtName" :key="appliance.mtName">
                {{ appliance.mtName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="厂商" prop="manufacturer">
            <Input v-model="form.manufacturer"></Input>
          </FormItem>
          <FormItem label="详情" prop="details">
            <Input v-model="form.details"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="add()">登记</Button>
          <Button @click="cancelAdd()">取消</Button>
        </div>
      </Modal>
      <Modal :mask-closable="false" :closable="false" v-model="modal2" title="信息更改">
        <Form ref="update" label-colon=":" :rules="ruleValidate" :model="updateForm" label-position="right"
          :label-width="100">
          <FormItem label="器械编号" prop="no">
            <Input v-model="updateForm.no"></Input>
          </FormItem>
          <FormItem label="器械名称" prop="name">
            <Input v-model="updateForm.name"></Input>
          </FormItem>
          <FormItem label="器械类型" prop="type">
            <Select filterable v-model="updateForm.type">
              <Option v-for="appliance in applianceTypeList" :value="appliance.mtName" :key="appliance.mtName">
                {{ appliance.mtName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="厂商" prop="manufacturer">
            <Input v-model="updateForm.manufacturer"></Input>
          </FormItem>
          <FormItem label="详情" prop="details">
            <Input v-model="updateForm.details"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="updated()">更改</Button>
          <Button @click="cancelUpdate()">取消</Button>
        </div>
      </Modal>
      <Modal :mask-closable="false" :closable="false" v-model="modal3" title="提示">
        此操作将无法恢复！您确定要删除吗？
        <div slot="footer">
          <Button type="primary" @click="del()">删除</Button>
          <Button @click="cancelDel()">取消</Button>
        </div>
      </Modal>
    </div>
    <div>
      <Table :columns="columns" :data="data"></Table>
    </div>
    <!-- 分页模块 -->
    <div id="page-box">
      <Page :total="total" :page-size="11" show-elevator @on-change="pageChange" />
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        columns: [{
            type: 'index',
            align: 'center',
            width: 60
          },
          {
            title: '操作',
            render: (h, params) => {
              return h("div", [
                h('Button', {
                  domProps: {
                    innerText: '更改'
                  },
                  props: {
                    type: 'primary',
                    disabled: params.row.status == 0 ? false : true
                  },
                  on: {
                    click: () => {
                      this.update(params)
                    }
                  }
                }),
                h('Button', {
                  domProps: {
                    innerText: '删除'
                  },
                  props: {
                    type: 'error',
                    disabled: params.row.status == 0 ? false : true
                  },
                  on: {
                    click: () => {
                      this.check(params)
                    }
                  }
                })
              ])
            },
            width: 200,
            align: 'center'
          },
          {
            title: '器械编号',
            key: 'no',
            width: 150
          },
          {
            title: '器械名称',
            key: 'name',
            width: 150
          },
          {
            title: '厂商',
            key: 'manufacturer',
            width: 150,
            render:(h, params) => {
              return h('div', [
                h('span', {
                  style: {display: 'inline-block', 
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'},
                  domProps: {title: params.row.manufacturer},
                  on:{click:(e) => { e.stopPropagation();}}
                }, params.row.manufacturer)
              ]);
          }
          },
          {
            title: '器械状态',
            key: 'status',
            render(h, params) {
              return h('div', [
                h('Badge', {
                  attrs: {
                    status: params.row.status == '1' ? 'error' : 'success'
                  }
                }),
                h('span', {
                  style: {
                    color: params.row.status == '1' ? 'red' : '#19be6b'
                  }
                }, params.row.status == '1' ? '借用中' : '在仓')
              ])
            },
            width: 150
          },
          {
            title: '器械类型',
            key: 'type',
            width: 150
          },
          {
            title: '器械详细',
            key: 'details',
            width: 600,
            render:(h, params) => {
              return h('div', [
                h('span', {
                  style: {display: 'inline-block', 
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'},
                  domProps: {title: params.row.details},
                  on:{click:(e) => { e.stopPropagation();}}
                }, params.row.details)
              ]);
          }
          }
        ],
        data: [],
        modal: false,
        modal2: false,
        modal3: false,
        total: 0,
        applianceTypeList: [],
        conditionForm: {
          type: '',
          no: '',
          name: ''
        },
        form: {
          no: '',
          name: '',
          manufacturer: '',
          type: '',
          details: ''
        },
        updateForm: {
          no: '',
          name: '',
          manufacturer: '',
          type: '',
          details: ''
        },
        delId: '',
        ruleValidate: {
          no: [{
            required: true,
            message: '编号不能为空',
            trigger: 'blur'
          }],
          name: [{
            required: true,
            message: '名称不能为空',
            trigger: 'change'
          }],
          manufacturer: [{
            required: true,
            message: '厂商不能为空',
            trigger: 'change'
          }],
          type: [{
            required: true,
            message: '类型',
            trigger: 'change'
          }]
        }
      }
    },
    created() {
      this.getEquipment()
      this.getApplianceType()
    },
    methods: {
      getApplianceType() {
        this.$http({
            url: 'appliance/getApplianceType',
            method: 'GET'
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.applianceTypeList = res.data.data
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      getEquipment() {
        this.$http({
            url: 'appliance/getAppliance',
            method: 'GET',
            params: this.conditionForm
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.data = res.data.data.list
              this.total = res.data.data.total
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
            url: 'appliance/getAppliance',
            method: 'GET',
            params: {
              type: this.conditionForm.type,
              no: this.conditionForm.no,
              name: this.conditionForm.name,
              pageNum: pageNum
            }
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.data = res.data.data.list
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      showAddPanel() {
        this.modal = true
      },
      cancelAdd() {
        this.$refs.add.resetFields();
        this.modal = false
      },
      add() {
        this.$refs.add.validate(valid => {
          if (valid) {
            this.$http({
                url: 'appliance/addEquipment',
                method: 'POST',
                data: this.form
              })
              .then((res) => {
                if (res.data.status === 200) {
                  this.$Message.info(res.data.data)
                  this.$refs.add.resetFields();
                  this.modal = false;
                  this.getEquipment()
                } else if (res.data.status === 500) {
                  this.$Message.info(res.data.msg)
                  this.modal = false;
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
      },
      update(params) {
        this.updateForm = this.data[params.index]
        this.modal2 = true;
      },
      updated() {
        this.$refs.update.validate(valid => {
          if (valid) {
            this.$http({
                url: 'appliance/update',
                method: 'POST',
                data: this.updateForm
              })
              .then((res) => {
                if (res.data.status === 200) {
                  this.modal2 = false;
                  this.$Message.info(res.data.data)
                  this.$refs.update.resetFields();
                  this.getEquipment()
                } else if (res.data.status === 500) {
                  this.modal2 = false;
                  this.$Message.info(res.data.msg)
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })

      },
      cancelUpdate() {
        this.modal2 = false;
      },
      check(params) {
        this.delId = params.row.id
        this.modal3 = true;
      },
      del() {
        this.$http({
            url: 'appliance/deleteById',
            method: 'DELETE',
            params: {
              id: this.delId
            }
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.$Message.info(res.data.data)
              this.modal3 = false;
              this.getEquipment()
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
              this.modal3 = false;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      cancelDel() {
        this.delId = ''
        this.modal3 = false;
      }
    }
  }

</script>
