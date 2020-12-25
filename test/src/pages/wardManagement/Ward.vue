<style scoped>
  #ward {
    text-align: left;
  }

  #select-box {
    text-align: center;
    margin-bottom: 7px;
  }

  #btn-box {
    margin-bottom: 7px;
  }

  #page-box {
    margin-top: 7px;
    text-align: center;
  }

</style>
<template>
  <div id="ward">
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
      <Modal v-model="modal1" title="新增病房">
        <Form v-model="form">
          <FormItem label="病房号">
            <Input type="number" v-model="form.wardId" />
          </FormItem>
          <FormItem label="科室">
            <Select filterable clearable v-model="form.deptId">
              <Option v-for="item in deptList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="病房类型">
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
    <Table :columns="columns" :data="datas" height="568px">
      <template slot-scope="{ row, index }" slot="action">
        <Button type="error" size="small" style="margin-right: 5px" @click="del(index)">删除</Button>
        <Button type="primary" size="small" style="margin-right: 5px" @click="update(index)">更改</Button>
      </template>
    </Table>
    <Modal v-model="modal2">
      <Form v-model="updateWard">
        <FormItem label="病房号">
          <Input type="number" v-model="updateWard.wardId" />
        </FormItem>
        <FormItem label="科室">
          <Select filterable clearable v-model="updateWard.deptId">
            <Option v-for="item in deptList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="病房类型">
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
      <Page :total="total" show-elevator @on-change="pageChange"></Page>
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
        pageNum: '',
        deleteWard: {
          wardId: '',
          deptId: ''
        },
        updateWard: {
          wardId: '',
          deptId: '',
          iwtId: '',
          oldWardId:'',
          oldDeptId:''
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
            url: 'http://localhost:8081/common/getDept',
            method: 'GET'
          })
          .then(res => {
            if (res.data.status === 200) {
              //console.log(res)
              this.deptList = res.data.data
            }
          })
          .catch(err => {
            console.log(err)
            this.$Message.info("服务器出错")
          })
      },
      getWard() {
        this.$http({
            url: 'http://localhost:8081/common/getWardByCondition',
            method: 'GET',
            params: {
              deptIdSelective: this.deptIdSelective,
              wardStatus: this.wardStatus,
              wardId: this.wardId
            }
          })
          .then(res => {
            if (res.data.status === 200) {
              console.log(res)
              this.datas = res.data.data.list
              this.total = res.data.data.total
            }
          })
          .catch(err => {
            console.log(err)
            this.$Message.info("服务器出错")
          })
      },
      getType() {
        this.$http({
            url: 'http://localhost:8081/common/getType',
            method: 'GET'
          })
          .then(res => {
            // console.log(res)
            if (res.data.status === 200) {
              this.wardTypeList = res.data.data;
            }
          })
          .catch(err => {
            this.$Message.info("服务器出错")
            console.log(err)
          })
      },
      addWard() {
        this.$http({
            url: 'http://localhost:8081/ward/addWard',
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

            }else if(res.data.status === 500){
              this.form = {
                wardId: '',
                deptId: '',
                iwtId: ''
              }
              this.$Message.info(res.data.data)
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
      },
      search() {
        this.$http({
            url: 'http://localhost:8081/common/getWardByCondition',
            method: 'GET',
            params: {
              deptIdSelective: this.deptIdSelective,
              wardStatus: this.wardStatus,
              wardId: this.wardId
            }
          })
          .then(res => {
            if (res.data.status === 200) {
              console.log(res)
              this.datas = res.data.data.list
              this.total = res.data.data.total
            }
          })
          .catch(err => {
            console.log(err)
            this.$Message.info("服务器出错")
          })
      },
      del(index) {
        this.deleteWard = {
          wardId : this.datas[index].wardId,
          deptId : this.datas[index].deptId
        }
        this.modal3 = true;
      },
      deleted() {
        this.$http({
          url:'http://localhost:8081/ward/delWard',
          method: 'DELETE',
          params:{
            wardId : this.deleteWard.wardId,
            deptId : this.deleteWard.deptId
          }
        })
        .then(res => {
          if (res.data.status === 200) {
            this.$Message.info("删除成功!")
            this.modal3 = false;
            this.getWard();
          }else if (res.data.status === 500) {
            this.$Message.info("删除失败,该病房下存在病床，无法删除！")
            this.modal3 = false;
            this.getWard();
          }        
        })
        .catch(err => {
          this.$Message.info("服务器出错！")
          this.modal3 = false;
        }) 
      },
      update(index) {
        this.updateWard = {
          oldWardId : this.datas[index].wardId,
          oldDeptId : this.datas[index].deptId,
          iwtId: this.datas[index].iwtId,
          wardId : this.datas[index].wardId,
          deptId : this.datas[index].deptId
        }
        this.modal2 = true;
      },
      updated() {
        this.$http({
          url:'http://localhost:8081/ward/updateWard',
          method:'POST',
          data:{
            wardId : this.updateWard.wardId,
            deptId : this.updateWard.deptId,
            iwtId : this.updateWard.iwtId,
            oldWardId : this.updateWard.oldWardId,
            oldDeptId : this.updateWard.oldDeptId
          }
        })
        .then(res=>{
          console.log(this.updateWard)
          if (res.data.status === 200) {
            this.$Message.info(res.data.data)
            this.modal2 = false;
            this.getWard();
          }else if(res.data.status === 500){
            this.$Message.info(res.data.data)
            this.modal2 = false;
            this.getWard();
          }
        })
        .catch(err=>{
          console.log(err)
          this.$Message.info("服务器出错")
          this.modal2 = false;
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
          wardId: '',
          deptId: ''
        }
        this.modal3 = false;
      },
      pageChange(pageNum) {
        this.$http({
            url: 'http://localhost:8081/common/getWardByCondition',
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
              console.log(res)
              this.datas = res.data.data.list
              this.pageNum = pageNum
              this.total = res.data.data.total
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
