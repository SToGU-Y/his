<style scoped>
  #bedEdit {
    text-align: left;
  }

  #select-box {
    text-align: center;
    margin-bottom: 5px;
  }

  #btn-box {
    margin-bottom: 5px;
  }

  #page-box {
    margin-top: 10px;
    text-align: center;
  }

</style>
<template>
  <div id="bedEdit">
    <div id="select-box">
      <div style="background:#eee;padding:20px">
        <Card :bordered="false">
          <div id="cardItem">
            <Form>
              <Select filterable clearable v-model="conditionForm.deptId" style="width:200px">
                <Option v-for="item in deptList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
              </Select>
              <Select filterable clearable v-model="conditionForm.iwtId" style="width:200px">
                <Option v-for="item in wardTypeList" :value="item.iwtId" :key="item.iwtId">{{ item.iwtType }}</Option>
              </Select>
              <Select clearable v-model="conditionForm.bedStatus" style="width:200px">
                <Option value="1">已用</Option>
                <Option value="0">未用</Option>
              </Select>
              <Input clearable v-model="conditionForm.bid" placeholder="请输入床号" clearable
                style="width: 200px; margin-right:5px" />
              <Input clearable v-model="conditionForm.name" placeholder="请输入病人姓名" clearable
                style="width: 200px; margin-right:5px" />
              <Button class="search-btn" type="primary" shape="circle" icon="ios-search"
                @click="getBedInformation()"></Button>
            </Form>
          </div>
        </Card>
      </div>
    </div>
    <div id="btn-box">
      <Button type="primary" @click="modal1 = true">新增病床</Button>

      <Modal :mask-closable="false" :closable="false" v-model="modal2" title="提示">
        此操作将无法恢复！<br>
        若之前有病人使用过该病床则信息会丢失,您确定要删除吗？
        <div slot="footer">
          <Button type="primary" @click="delBed()">删除</Button>
          <Button @click="cancelDel()">取消</Button>
        </div>
      </Modal>

      <Modal :mask-closable="false" :closable="false" v-model="modal1" title="新增病床">
        <Form ref="addform" :model="addform" :rules="ruleValidate" label-colon=":" label-position="right" :label-width="80">
          <FormItem label="科室">
            <Select style="margin-bottom: 10px; " @on-change="getWardByDept">
              <Option v-for="item in deptList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="病房" prop="wid">
            <Select :disabled="disabled" v-model="addform.wid" style="margin-bottom: 10px; ">
              <Option v-for="item in wardList" :value="item.wid" :key="item.wid">{{ item.wardId }}号病房</Option>
            </Select>
          </FormItem>
          <FormItem label="床位号" prop="bid">
            <Input type="number" v-model="addform.bid" />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="addBed">增加</Button>
          <Button type="error" @click="cancelAdd">取消</Button>
        </div>
      </Modal>
    </div>

    <Table :columns="columns" :data="datas"></Table>

    <div id="page-box">
      <Page :total="total" @on-change="pageChange" :page-size="11"></Page>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        modal1: false,
        modal2: false,
        disabled: true,
        columns: [{
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
                }, params.row.bedStatus == '1' ? '已用' : '未用')
              ])
            }
          },
          {
            title: '住院号',
            key: 'admissionNumber'
          },
          {
            title: '病人姓名',
            key: 'pname'
          },
          {
            title: '操作',
            render: (h, params) => {
              return h("Button", {
                domProps: {
                  innerText: '删除'
                },
                props: {
                  type: 'error',
                  disabled: params.row.pname == null ? false : true
                },
                on: {
                  click: () => {
                    this.check(params)
                  }
                }
              })
            },
            align: 'center'
          }
        ],
        deptList: [],
        wardTypeList: [],
        wardList: [],
        datas: [],
        conditionForm: {
          deptId: '',
          bedStatus: '',
          iwtId: '',
          bid: '',
          name: ''
        },
        total: 0,
        addform: {
          wid: '',
          bid: ''
        },
        delid: '',
        ruleValidate: {
          wid: [{
            required: true,
            message: '病房号不能为空',
            trigger: 'blur',
            type:'number'
          }],
          bid: [{
            required: true,
            message: '床位号不能为空',
            trigger: 'blur'
          }]
        }
      }
    },
    created() {
      this.getDept();
      this.getType();
      this.getBedInformation();
    },
    methods: {
      getBedInformation() {
        this.$http({
            url: 'bed/getAllBed',
            method: 'GET',
            params: this.conditionForm
          })
          .then(res => {
            if (res.data.status === 200) {
              this.datas = res.data.data.list
              this.total = res.data.data.total
            }else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err);
          })
      },
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
      getWardByDept(params) {
        this.$http({
            url: 'ward/getWardByDept',
            method: 'GET',
            params: {
              deptId: params
            }
          })
          .then(res => {
            if (res.data.status === 200) {
              this.wardList = res.data.data
              this.disabled = false;
            }else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err);
          })
      },
      addBed() {
        this.$refs.addform.validate(valid=>{
          if (valid) {
            this.$http({
            url: 'bed/addBed',
            method: 'POST',
            data: this.addform
          })
          .then(res => {
            if (res.data.status === 200) {
              this.modal1 = false;
              this.$Message.info("添加成功!")
              this.$refs.addform.resetFields()
              this.getBedInformation();
            }else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err);
          })
          }
        })
      },
      cancelAdd() {
        this.modal1 = false;
      },
      check(params) {
        this.delid = params.row.id;
        this.modal2 = true;
      },
      delBed() {
        this.$http({
            url: 'bed/delBed',
            method: 'DELETE',
            params: {
              id: this.delid
            }
          })
          .then((res) => {
            if (res.data.status === 200) {
              this.$Message.info(res.data.data)
              this.modal2 = false
              this.delid = ''
              this.getBedInformation();
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
              this.modal2 = false
              this.delid = ''
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      cancelDel() {
        this.delid = ''
        this.modal2 = false
      },
      pageChange(pageNum) {
        this.$http({
            url: 'bed/getAllBed',
            method: 'GET',
            params: {
              deptId: this.conditionForm.deptId,
              bedStatus: this.conditionForm.bedStatus,
              iwtId: this.conditionForm.iwtId,
              bid: this.conditionForm.bid,
              name:this.conditionForm.name,
              pageNum: pageNum
            }
          })
          .then(res => {
            if (res.data.status === 200) {
              this.datas = res.data.data.list
              this.total = res.data.data.total
            }else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err);
          })
      }
    }
  }

</script>
