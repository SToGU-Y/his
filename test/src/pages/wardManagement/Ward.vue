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
            <Select filterable clearable v-model="status" style="width:200px">
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
            <Select filterable clearable v-model="form.deptIdSelective">
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
        status: '',
        datas: [],
        deptList: [],
        deptIdSelective: '',
        wardId: '',
        total: 0,
        form: {
          wardId: '',
          deptIdSelective: '',
          iwtId: ''
        },
        wardTypeList: [],
        pageNum:''
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
            url: 'http://localhost:8081/common/getWardByPage',
            method: 'GET'
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
          url:'',
          method:''
        })
        .then({
          
        })
        .catch({

        })
      },
      del() {},
      update() {},
      updated() {},
      cancelupdate() {},
      cancelAdd() {
        this.modal1 = false;
      },
      pageChange(pageNum) {
        this.$http({
            url: 'http://localhost:8081/common/getWardByPage',
            method: 'GET',
            params:{
              pageNum: pageNum
            }
          })
          .then(res => {
            if (res.data.status === 200) {
              console.log(res)
              this.datas = res.data.data.list
              this.pageNum = pageNum;
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
