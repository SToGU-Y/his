<style scoped>
  #ward {
    text-align: left;
  }

  #select-box {
    text-align: center;
    margin-bottom: 5px;
  }

  #btn-box {
    text-align: left;
    margin-bottom: 5px;
  }

  #page-box {
    margin-top: 10px;
    text-align: center;
  }

</style>
<template>
  <div id="wardEdit">
    <div id="select-box">
      <div style="background:#eee;padding:20px">
        <Card :bordered="false">
          <div id="cardItem">
            <Select filterable clearable v-model="deptIdSelective" style="width:200px">
              <Option v-for="item in deptList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
            </Select>
            <Select filterable clearable v-model="wardStatus" style="width:200px">
              <Option value="0">未满</Option>
              <Option value="1">已满</Option>
            </Select>
            <Input v-model="wardId" placeholder="请输入病房号" clearable style="width: 200px; margin-right:5px" />
            <Button class="search-btn" type="primary" shape="circle" icon="ios-search" @click="search()"></Button>
          </div>
        </Card>
      </div>
    </div>
    <div id="btn-box">
      <Button type="primary" @click="modal1 = true">新增病房</Button>
      <Modal :mask-closable="false" :closable="false" v-model="modal1" title="新增病房">
        <Form ref="add" label-position="right" :label-width="100" label-colon=":" :rules="ruleValidate" :model="form">
          <FormItem label="病房号" prop="wardId">
            <Input type="number" v-model="form.wardId" />
          </FormItem>
          <FormItem label="科室" prop="deptId">
            <Select filterable clearable v-model="form.deptId">
              <Option v-for="item in deptList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="病房类型" prop="iwtId">
            <Select filterable clearable v-model="form.iwtId">
              <Option v-for="wardType in wardTypeList" :value="wardType.iwtId" :key="wardType.iwtId">
                {{ wardType.iwtType }}</Option>
            </Select>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="addWard()">添加</Button>
          <Button @click="cancelAdd()">取消</Button>
        </div>
      </Modal>
    </div>
    <Table :columns="columns" :data="datas">
      <template slot-scope="{ row, index }" slot="action">
        <Button type="error" size="small" style="margin-right: 5px" @click="del(index)">删除</Button>
        <Button type="primary" size="small" style="margin-right: 5px" @click="update(index)">更改</Button>
      </template>
    </Table>
    <Modal :mask-closable="false" :closable="false" v-model="modal2" title="更改信息">
      <Form ref="update" label-position="right" :label-width="100" label-colon=":" :rules="ruleValidate"
        :model="updateWard">
        <FormItem label="病房号" prop="wardId">
          <Input type="number" v-model="updateWard.wardId" />
        </FormItem>
        <FormItem label="科室" prop="deptId">
          <Select filterable clearable v-model="updateWard.deptId">
            <Option v-for="item in deptList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="病房类型" prop="iwtId">
          <Select filterable clearable v-model="updateWard.iwtId">
            <Option v-for="wardType in wardTypeList" :value="wardType.iwtId" :key="wardType.iwtId">
              {{ wardType.iwtType }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="updated()">更新</Button>
        <Button @click="cancelupdate()">取消</Button>
      </div>
    </Modal>
    <Modal v-model="modal3" title="提示">
      此操作将无法恢复！您确定要删除吗？
      <div slot="footer">
        <Button type="primary" @click="deleted()">删除</Button>
        <Button @click="cancelDel()">取消</Button>
      </div>
    </Modal>
    <div id="page-box">
      <Page :total="total" show-elevator @on-change="pageChange" :page-size="11"></Page>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        columns: [{
            title: '所在科室',
            key: 'deptName'
          },
          {
            title: '病房',
            key: 'wardId'
          },
          {
            title: '病房类型',
            key: 'iwtType'
          },
          {
            title: '病房状态',
            key: 'wardStatus',
            render: (h, params) => {
              return h('div', [
                h('Badge', {
                  attrs: {
                    status: params.row.wardStatus == '1' ? 'error' : 'success'
                  }
                }),
                h('span', {
                  style: {
                    color: params.row.wardStatus == '1' ? 'red' : '#19be6b'
                  }
                }, params.row.wardStatus == '1' ? '已满' : '未满')
              ])
            }
          },
          {
            title: '病房可住人数',
            key: 'wardBedNum'
          },
          {
            title: '病房价格',
            key: 'iwtPrice'
          },
          {
            title: '操作',
            slot: 'action',
            width: 150,
            align: 'center'
          }
        ],
        modal1: false,
        modal2: false,
        modal3: false,
        wardStatus: '',
        deptIdSelective: '',
        wardId: '',
        datas: [],
        deptList: [],
        total: 0,
        form: {
          wardId: '',
          deptId: '',
          iwtId: ''
        },
        wardTypeList: [],
        pageNum: 1,
        deleteWard: {
          id: ''
        },
        updateWard: {
          wardId: '',
          deptId: '',
          iwtId: '',
          id: ''
        },
        ruleValidate: {
          wardId: [{
            required: true,
            message: '病房号不能为空',
            trigger: 'blur'
          }],
          deptId: [{
            required: true,
            message: '科室不能为空',
            trigger: 'change'
          }],
          iwtId: [{
            required: true,
            message: '病房类型不能为空',
            trigger: 'change',
            type: 'number'
          }]
        }
      }
    },

    created() {
      this.getDept();
      this.getWard();
      this.getType();
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
      getWard() {
        this.$http({
            url: 'ward/getWardByCondition',
            method: 'GET',
            params: {
              deptIdSelective: this.deptIdSelective,
              wardStatus: this.wardStatus,
              wardId: this.wardId
            }
          })
          .then(res => {
            if (res.data.status === 200) {
              this.datas = res.data.data.list
              this.total = res.data.data.total
            } else if (res.data.status === 500) {
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
              this.wardTypeList = res.data.data;
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            this.$Message.info("服务器出错")
            console.log(err)
          })
      },
      addWard() {
        this.$refs.add.validate(valid => {
          if (valid) {
            this.$http({
                url: 'ward/addWard',
                method: 'POST',
                data: {
                  deptId: this.form.deptId,
                  wardId: this.form.wardId,
                  iwtId: this.form.iwtId
                }
              })
              .then(res => {
                if (res.data.status === 200) {
                  this.form = {
                    wardId: '',
                    deptId: '',
                    iwtId: ''
                  }
                  this.$Message.info(res.data.data)
                  this.modal1 = false;
                  this.getWard();
                } else if (res.data.status === 500) {
                  this.form = {
                    wardId: '',
                    deptId: '',
                    iwtId: ''
                  }
                  this.$Message.info(res.data.msg)
                  this.modal1 = false;
                  this.getWard();
                }
              })
              .catch(err => {
                console.log(err)
                this.form = {
                  wardId: '',
                  deptId: '',
                  iwtId: ''
                }
                this.$Message.info("服务器出错")
                this.modal1 = false;
              })
          }
        })
      },
      search() {
        this.$http({
            url: 'ward/getWardByCondition',
            method: 'GET',
            params: {
              deptIdSelective: this.deptIdSelective,
              wardStatus: this.wardStatus,
              wardId: this.wardId
            }
          })
          .then(res => {
            if (res.data.status === 200) {
              this.datas = res.data.data.list
              this.total = res.data.data.total
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err)
            this.$Message.info("服务器出错")
          })
      },
      del(index) {
        this.deleteWard = {
          id: this.datas[index].wid
        }
        this.modal3 = true;
      },
      deleted() {
        this.$http({
            url: 'ward/delWard',
            method: 'DELETE',
            params: {
              id: this.deleteWard.id
            }
          })
          .then(res => {
            if (res.data.status === 200) {
              this.$Message.info("删除成功!")
              this.modal3 = false;
              this.getWard();
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
              this.modal3 = false;
            }
          })
          .catch(err => {
            this.$Message.info("服务器出错！")
            this.modal3 = false;
          })
      },
      update(index) {
        this.updateWard = {
          id: this.datas[index].wid,
          iwtId: this.datas[index].iwtId,
          wardId: this.datas[index].wardId,
          deptId: this.datas[index].deptId
        }
        this.modal2 = true;
      },
      updated() {
        this.$refs.update.validate(valid => {
          if (valid) {
            this.$http({
                url: 'ward/updateWard',
                method: 'POST',
                data: {
                  wardId: this.updateWard.wardId,
                  deptId: this.updateWard.deptId,
                  iwtId: this.updateWard.iwtId,
                  wid: this.updateWard.id
                }
              })
              .then(res => {
                if (res.data.status === 200) {
                  this.$Message.info(res.data.data)
                  this.modal2 = false;
                  this.getWard();
                } else if (res.data.status === 500) {
                  this.$Message.info(res.data.msg)
                  this.modal2 = false;
                }
              })
              .catch(err => {
                console.log(err)
                this.$Message.info("服务器出错")
                this.modal2 = false;
              })
          }
        })

      },
      cancelupdate() {
        this.modal2 = false;
      },
      cancelAdd() {
        this.form = {
          wardId: '',
          deptId: '',
          iwtId: ''
        }
        this.modal1 = false;
      },
      cancelDel() {
        this.deleteWard = {
          id: ''
        }
        this.modal3 = false;
      },
      pageChange(pageNum) {
        this.$http({
            url: 'ward/getWardByCondition',
            method: 'GET',
            params: {
              deptIdSelective: this.deptIdSelective,
              wardStatus: this.wardStatus,
              wardId: this.wardId,
              pageNum: pageNum
            }
          })
          .then(res => {
            if (res.data.status === 200) {
              this.datas = res.data.data.list
              this.pageNum = pageNum
              this.total = res.data.data.total
            } else if (res.data.status === 500) {
              this.$Message.info(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err)
            this.$Message.info("服务器出错")
          })
      }
    }
  }

</script>
